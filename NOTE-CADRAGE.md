# Note de cadrage — ActionOS Lite

Cas pratique technique DIZIGROUP (réf. DFSJIA-001).

## 1. Fonctionnalités retenues

Les 6 fonctionnalités obligatoires du barème sont implémentées et fonctionnelles :

1. **Compte rendu** — création (titre, date, texte collé), persistance en base.
2. **Actions** — reliées à leur compte rendu d'origine.
3. **Champs clés** — description, responsable, échéance, priorité sur chaque action.
4. **Validation humaine** — relecture, correction, suppression, complément avant enregistrement ; les corrections restent possibles après coup depuis la page du compte rendu.
5. **Tableau de suivi** — filtre par statut, changement de statut, détection des retards (calculée à l'affichage, jamais stockée).
6. **Persistance** — les données survivent à une actualisation (PostgreSQL).

L'extraction est déterministe (moteur de règles), fonctionne aussi bien sur des puces que sur de la prose continue, et ne remonte jamais un responsable ou une échéance inventés : l'information manquante reste `null` et l'action remonte comme « à confirmer ».

## 2. Fonctionnalités écartées

Écartées volontairement pour tenir le budget de temps et respecter la consigne du client (« une solution simple terminée vaut mieux qu'une solution ambitieuse inachevée ») :

- **Authentification et multi-utilisateur** — un seul utilisateur est supposé ; pas de notion de compte ni de permissions dans ce MVP.
- **Notifications et rappels** — aucune alerte sur les échéances approchantes ou dépassées ; le retard est visible dans le tableau de suivi, pas poussé à l'utilisateur.
- **Import de fichiers (.docx, audio)** — seul le texte collé est supporté ; pas de transcription ni de parsing de document.
- **Commentaires et historique de modification** — une action se corrige en place, sans trace de qui a changé quoi ni de fil de discussion.
- **Temps réel** — pas de synchronisation live entre plusieurs onglets ou utilisateurs ; il faut recharger pour voir les changements d'un autre poste.
- **Couche IA** — voir section 6 du README ; sacrifiée pour privilégier une extraction déterministe testée plutôt qu'une IA à moitié branchée.

## 3. Risques identifiés

- **Extraction incomplète sur des formats inhabituels.** Le moteur de règles reconnaît des motifs connus (puces, verbes d'action, structure « Prénom doit… », marqueurs d'incertitude). Un texte structuré très différemment pourrait faire manquer une action. Rattrapé par la validation humaine obligatoire avant tout enregistrement.
- **Hallucination si une IA est branchée plus tard.** Le port `ActionExtractor` permettrait d'ajouter un adaptateur IA sans toucher au reste du code. Le risque serait qu'un LLM invente un responsable ou une échéance absents du texte. Parade prévue si ce chantier est repris : prompt imposant explicitement `null` quand l'information n'est pas dans le texte, plus validation humaine obligatoire, inchangée.
- **Clé API exposée.** Non applicable aujourd'hui (aucune IA branchée, donc aucune clé). Si une IA est ajoutée, la parade est structurelle : variables d'environnement côté serveur uniquement, jamais dans le code ni côté front.

## 4. Suite proposée

Par ordre de priorité si le projet continue :

1. Déploiement en ligne (API + front) pour lever le risque « application impossible à lancer ».
2. Couche IA (`AiExtractor`) en complément des règles, avec repli automatique sur `RulesExtractor` en cas d'échec (clé absente, timeout, JSON invalide, quota), et badge d'origine (`RÈGLE` / `IA` / `MANUEL`) déjà prévu en base (`Origine`).
3. Authentification simple si l'outil doit être partagé par plusieurs personnes.
4. Notifications sur les échéances à venir ou dépassées.
5. Import de documents (.docx) comme alternative au copier-coller.

## 5. Temps consacré

**4h15** de travail effectif déclaré.
