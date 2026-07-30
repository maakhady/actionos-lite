# ActionOS Lite

MVP — cas pratique technique DIZIGROUP (réf. DFSJIA-001, Développeur Full Stack Junior — IA, Automatisation & Produits Digitaux).

## 1. Objectif

On colle le texte d'un compte rendu de réunion (prose libre ou liste à puces), l'outil en extrait des propositions d'actions (description, responsable, échéance, priorité), un humain les relit — corrige, complète, supprime — avant de les enregistrer. Elles sont ensuite suivies dans un tableau : filtre par statut, changement de statut, détection des retards.

Contrainte structurante du client : **le MVP doit fonctionner sans dépendre d'une IA.** L'extraction repose sur un moteur de règles déterministe ; une IA optionnelle peut s'y ajouter en complément, jamais en remplacement (voir [section 6](#6-usage-de-lia)).

Le fil rouge du produit : *l'outil ne devine pas, il vous dit ce qu'il ne sait pas.* Quand le texte ne précise ni responsable ni échéance, le champ reste vide et l'action remonte comme « à confirmer » plutôt que d'inventer une valeur.

## 2. Stack

| Composant | Technologie |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS |
| Backend | NestJS 11 + Prisma 6 |
| Base de données | PostgreSQL 16 (Docker) |
| Tests | Jest (17 tests unitaires sur l'extraction) |

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

L'API écoute sur `http://localhost:3000`. `npm test` fait tourner les 17 tests unitaires de l'extraction.

**IA optionnelle** : sans clé, l'extraction reste 100 % déterministe. Pour l'activer, ajouter dans `api/.env` :
```
ANTHROPIC_API_KEY=sk-ant-...
```

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

**L'IA est optionnelle et n'est jamais requise.** Par défaut (sans `ANTHROPIC_API_KEY`), l'extraction est intégralement assurée par `RulesExtractor`, un moteur de règles déterministe et testé — conforme à la consigne du client : « le MVP doit fonctionner sans dépendre d'une IA ».

Si une clé est configurée, `AiExtractor` (Claude Haiku 4.5) est essayé en premier, via des **sorties structurées** (le JSON renvoyé est garanti conforme à un schéma, pas parsé depuis du texte libre). En cas d'échec — clé invalide, timeout, quota dépassé, réponse malformée — `FallbackExtractor` retombe automatiquement et silencieusement sur `RulesExtractor`. Aucun chemin ne peut planter l'analyse à cause de l'IA.

Le prompt impose explicitement de ne jamais inventer un responsable ou une échéance absents du texte (`null` sinon) — la même règle que le moteur déterministe. Que l'action vienne des règles, de l'IA ou d'un ajout manuel, elle passe par la **même validation humaine obligatoire** avant tout enregistrement, et porte un badge d'origine (`Règle` / `IA` / `Manuel`) visible dans l'interface.

`ANTHROPIC_API_KEY` se configure uniquement côté serveur, dans `api/.env` — jamais dans le code, jamais côté front, jamais commité (`.env` est ignoré par git).
