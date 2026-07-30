# ActionOS Lite

MVP — cas pratique technique DIZIGROUP (réf. DFSJIA-001, Développeur Full Stack Junior — IA, Automatisation & Produits Digitaux).

## 1. Objectif

On colle le texte d'un compte rendu de réunion (prose libre ou liste à puces), l'outil en extrait des propositions d'actions (description, responsable, échéance, priorité), un humain les relit — corrige, complète, supprime — avant de les enregistrer. Elles sont ensuite suivies dans un tableau : filtre par statut, changement de statut, détection des retards.

Contrainte structurante du client : **le MVP doit fonctionner sans dépendre d'une IA.** L'extraction est un moteur de règles déterministe ; l'IA n'a pas été branchée dans cette version (voir [section 6](#6-usage-de-lia)).

Le fil rouge du produit : *l'outil ne devine pas, il vous dit ce qu'il ne sait pas.* Quand le texte ne précise ni responsable ni échéance, le champ reste vide et l'action remonte comme « à confirmer » plutôt que d'inventer une valeur.

## 2. Stack

| Composant | Technologie |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS |
| Backend | NestJS 11 + Prisma 6 |
| Base de données | PostgreSQL 16 (Docker) |
| Tests | Jest (10 tests unitaires sur l'extracteur) |

## 3. Installation (clone vierge)

Prérequis : Node.js ≥ 20, Docker, Docker Compose.

### 3.1 Base de données

```bash
git clone https://github.com/maakhady/actionos-lite.git
cd actionos-lite
docker compose up -d
docker compose ps   # attendre que "db" soit "healthy"
```

Le port **5433** (et non 5432) est volontaire : 5432 est souvent déjà occupé par un PostgreSQL local sur la machine de développement.

### 3.2 API

```bash
cd api
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run start:dev
```

L'API écoute sur `http://localhost:3000`. `npm test` fait tourner les 10 tests unitaires de l'extracteur.

### 3.3 Front

Dans un second terminal :

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Le front est sur `http://localhost:5173`.

### 3.4 Vérification rapide

Ouvrir `http://localhost:5173` → « Comptes rendus » doit lister le compte rendu Quizz+ inséré par le seed.

## 4. Architecture

```
actionos-lite/
├── docker-compose.yml
├── api/            NestJS + Prisma
│   ├── prisma/     schema, migrations, seed
│   └── src/
│       ├── extraction/    moteur d'extraction déterministe (voir ci-dessous)
│       ├── comptes-rendus/
│       └── actions/
└── web/            React + Vite
    └── src/pages/  Reunions, Saisie, Validation, Suivi
```

**Une seule règle architecturale, appliquée à un seul endroit** : les dépendances pointent vers l'intérieur. `api/src/extraction/rules.extractor.ts` et `api/src/extraction/domain/` sont du TypeScript pur — aucun import NestJS ni Prisma. L'inversion de dépendance (`ACTION_EXTRACTOR` / interface `ActionExtractor`) n'existe qu'à cet endroit, parce que c'est le seul point où deux implémentations interchangeables ont réellement du sens (règles déterministes vs. IA — voir section 6). Un port sans deuxième adaptateur ailleurs dans le code aurait été de la cérémonie inutile.

Autres choix délibérés :
- Pas de pattern Repository sur Prisma : Prisma est déjà l'abstraction de la base ; une interface avec une seule implémentation est une couche morte.
- `responsable` et `echeance` sont `null`, jamais chaîne vide : `null` matérialise « l'information n'est pas dans le texte ».
- Le retard n'est pas stocké en base, il est calculé à l'affichage (`echeance < aujourd'hui && statut !== TERMINE`) : un booléen stocké serait faux dès le lendemain.
- La validation d'un lot d'actions (`POST /actions/valider`) est transactionnelle (`createMany`) : un enregistrement partiel laisserait un compte rendu à moitié traité.

## 5. Limites connues

- **Extraction par règles, pas par apprentissage** : le moteur reconnaît des motifs (puces, verbes d'action, structure sujet-verbe « Prénom doit… », marqueurs d'incertitude comme « pas encore »). Sur un texte très inhabituel, il peut manquer une action ou en proposer une hors sujet — c'est précisément pour ça que la validation humaine avant enregistrement n'est jamais sautée.
- **Un seul utilisateur, pas d'authentification** : hors périmètre du MVP (voir NOTE-CADRAGE.md pour l'arbitrage).
- **Pas d'import de fichiers** (.docx, audio) : seul le texte collé est supporté.
- **Pas de notifications ni de rappels** sur les échéances approchantes.

Détail complet des fonctionnalités écartées et pourquoi : voir `NOTE-CADRAGE.md`.

## 6. Usage de l'IA

**Aucune IA n'est branchée dans cette version.** L'extraction des actions est intégralement assurée par `RulesExtractor`, un moteur de règles déterministe et testé (10 tests unitaires), sans appel à un modèle de langage.

Ce choix est un arbitrage de temps assumé, pas un oubli : le client demande explicitement que « le MVP fonctionne sans dépendre d'une IA » et qu'une « solution simple terminée vaille mieux qu'une solution ambitieuse inachevée ». L'architecture le permet sans réécriture : `ActionExtractor` est une interface, `RulesExtractor` en est la seule implémentation aujourd'hui, mais un `AiExtractor` pourrait l'implémenter demain et être branché par un simple changement de provider NestJS, avec repli automatique sur les règles en cas d'échec (clé absente, timeout, JSON invalide). Si elle existait, cette couche IA resterait soumise à la même contrainte que les règles : ne jamais inventer un responsable ou une échéance absents du texte, et toujours passer par la validation humaine avant enregistrement.
