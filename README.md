 Système de Quiz Dynamique

Application web de quiz interactive construite avec React, Node.js, Express et MySQL. Le projet permet à un utilisateur de s'inscrire, se connecter, choisir un ou plusieurs thèmes, lancer une session de quiz chronométrée, enregistrer ses réponses et consulter un classement.

 I. Table des matières

- [II. À propos du projet](ii-à-propos-du-projet)
- [III. Fonctionnalités](iii-fonctionnalités)
- [IV. Stack technique](iv-stack-technique)
- [V. Prérequis](v-prérequis)
- [VI. Installation](vi-installation)
- [VII. Configuration](vii-configuration)
- [VIII. Structure du projet](viii-structure-du-projet)
- [IX. Base de données](ix-base-de-données)
- [X. Lancement](x-lancement)
- [XI. API Endpoints](xi-api-endpoints)
- [XII. Contribution](xii-contribution)
- [XIII. Licence](xiii-licence)
- [XIV. Contact](xiv-contact)

 II. À propos du projet

Ce projet est un mini système de quiz dynamique orienté apprentissage et évaluation rapide des connaissances. Il propose une interface moderne côté frontend et une API REST côté backend pour gérer :

- l'authentification des utilisateurs ;
- la récupération des thèmes et des questions ;
- le déroulement d'une session de quiz ;
- l'enregistrement des réponses, scores et classements ;
- l'administration des questions via API.

Le dépôt est organisé en un seul répertoire contenant le frontend React, le serveur Express, les scripts SQL d'initialisation et les données supplémentaires.

 III. Fonctionnalités

- Inscription et connexion utilisateur avec mot de passe chiffré via `bcrypt`.
- Authentification par jeton `JWT`.
- Vérification automatique de session au chargement de l'application.
- Sélection multiple de thèmes avant démarrage du quiz.
- Choix du nombre de questions : `5`, `10`, `15` ou `20`.
- Choix de difficulté : `facile`, `moyen`, `difficile` ou `mixte`.
- Récupération aléatoire des questions depuis MySQL.
- Timer par question avec retour visuel.
- Validation immédiate de la réponse avec explication.
- Calcul et affichage du score final.
- Historique des scores côté API.
- Classement global des meilleurs joueurs.
- Endpoints d'ajout, modification et désactivation de questions.
- Jeux de données SQL pour enrichir la base avec plusieurs lots de questions.

 IV. Stack technique

 IV.1 Frontend

- React `18`
- React Router DOM `6`
- Vite `5`
- CSS injecté directement dans `App.jsx`

 IV.2 Backend

- Node.js
- Express
- MySQL2 (`mysql2/promise`)
- `dotenv`
- `helmet`
- `cors`
- `morgan`
- `express-rate-limit`
- `bcrypt`
- `jsonwebtoken`

 IV.3 Base de données

- MySQL / MariaDB
- Script principal : `schema.sql`
- Jeux complémentaires : `question02.sql` et `question03.sql`

 V. Prérequis

- Node.js `18+` recommandé
- npm
- MySQL ou MariaDB
- WampServer, XAMPP ou un serveur MySQL local équivalent

 VI. Installation

 VI.1 Préparation du projet

1. Cloner ou copier le projet dans votre environnement local.
2. Ouvrir un terminal dans le dossier du projet :

```bash
cd quizz_dynamique_d_03
```

 VI.2 Installation des dépendances

```bash
npm install
```

 VI.3 Initialisation de la base principale

```bash
mysql -u root -p < schema.sql
```

 VI.4 Import des jeux de questions complémentaires

```bash
mysql -u root -p quiz_dynamique < question02.sql
mysql -u root -p quiz_dynamique < question03.sql
```

 VII. Configuration

 VII.1 Fichier d'environnement

Le projet utilise un fichier `.env` à la racine.

Variables actuellement utilisées par `server.js` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=quiz_dynamique
JWT_SECRET=change_me
FRONTEND_URL=http://localhost:5173
PORT=3001
```

 VII.2 Remarques importantes

- `PORT` n'est pas présent dans le `.env` actuel mais le backend le supporte.
- Le frontend appelle l'API via l'URL codée en dur `http://localhost:3001/api`.
- Si vous changez le port backend, il faut aussi adapter `API_BASE` dans les composants React.
- En production, il faut impérativement remplacer `JWT_SECRET`.

 VIII. Structure du projet

 VIII.1 Arborescence principale

```text
quizz_dynamique_d_03/
├── App.jsx
├── main.jsx
├── index.html
├── server.js
├── schema.sql
├── question02.sql
├── question03.sql
├── package.json
├── package_backend.json
├── .env
├── components/
│   ├── AuthPage.jsx
│   ├── HomePage.jsx
│   ├── Navbar.jsx
│   └── QuizPage.jsx
├── dist/
└── node_modules/
```

 VIII.2 Description des fichiers principaux

- `App.jsx` : configuration générale, routes et styles globaux.
- `main.jsx` : point d'entrée React.
- `components/HomePage.jsx` : page d'accueil et top 5 du classement.
- `components/AuthPage.jsx` : formulaires d'inscription et connexion.
- `components/QuizPage.jsx` : configuration du quiz, déroulement, timer et résultats.
- `components/Navbar.jsx` : barre de navigation.
- `server.js` : API REST Express et connexion MySQL.
- `schema.sql` : schéma complet et données initiales.
- `question02.sql` et `question03.sql` : lots additionnels de questions.
- `package_backend.json` : manifeste backend secondaire conservé dans le dépôt.

 IX. Base de données

 IX.1 Objets créés par le schéma principal

Le schéma principal crée la base `quiz_dynamique` et les objets suivants :

- `themes` : liste des thèmes affichés dans le quiz.
- `questions` : banque de questions avec options JSON, difficulté et points.
- `utilisateurs` : comptes utilisateurs.
- `step` : sessions de quiz démarrées par les joueurs.
- `resultats` : détail des réponses données.
- `scores` : scores enregistrés pour le classement.
- `v_classement` : vue SQL de classement simplifiée.

 IX.2 Thèmes présents

1. `Capitales du monde`
2. `Histoire`
3. `Sciences`
4. `Géographie`
5. `Deviner le film`
6. `Acteurs célèbres`
7. `Séries populaires`
8. `Répliques cultes`

 IX.3 Données fournies

- `schema.sql` contient le schéma complet et un premier lot de questions.
- `question02.sql` ajoute un second lot.
- `question03.sql` ajoute un troisième lot.

Après analyse des trois fichiers SQL du projet, l'ensemble contient actuellement `122` questions réparties sur les `8` thèmes.

 X. Lancement

 X.1 Démarrer le backend

```bash
node server.js
```

Le serveur démarre par défaut sur :

```text
http://localhost:3001
```

 X.2 Démarrer le frontend

```bash
npm run dev
```

L'application Vite est accessible par défaut sur :

```text
http://localhost:5173
```

 X.3 Build de production

```bash
npm run build
```

Puis prévisualisation locale :

```bash
npm run preview
```

 XI. API Endpoints

 XI.1 Base URL

```text
http://localhost:3001/api
```

 XI.2 Santé

- `GET /health` : vérifie que l'API répond.

 XI.3 Authentification

- `POST /auth/register` : créer un compte utilisateur.
- `POST /auth/login` : se connecter.
- `GET /auth/me` : récupérer l'utilisateur connecté.

 XI.4 Utilisateur

- `GET /user/scores` : historique des scores du joueur connecté.

 XI.5 Thèmes

- `GET /themes` : récupérer tous les thèmes actifs.
- `GET /themes/:id` : récupérer un thème avec son nombre total de questions.

 XI.6 Questions

- `GET /questions?themes=1,2&limit=10&difficulty=moyen` : récupérer une liste aléatoire de questions filtrées.
- `GET /questions/:id` : récupérer le détail d'une question.

 XI.7 Sessions de quiz

- `POST /step` : créer une session de quiz.
- `PUT /step/:id/finish` : terminer une session et enregistrer le score.

 XI.8 Résultats

- `POST /resultats` : enregistrer une réponse à une question.

 XI.9 Classement

- `GET /classement?limit=10` : récupérer les meilleurs scores.

 XI.10 Administration des questions

- `POST /admin/questions` : ajouter une question.
- `PUT /admin/questions/:id` : modifier une question existante.
- `DELETE /admin/questions/:id` : désactiver une question.

 XI.11 Note de sécurité

Les routes `/auth/me`, `/user/scores`, `/step` et `/step/:id/finish` sont protégées par JWT. Les routes d'administration existent bien mais, dans l'état actuel du code, elles ne vérifient pas encore côté serveur qu'un utilisateur est administrateur.

 XII. Contribution

Les contributions sont bienvenues.

 XII.1 Étapes proposées

1. Forker le projet.
2. Créer une branche dédiée à votre fonctionnalité ou correction.
3. Effectuer vos modifications.
4. Tester manuellement le frontend, le backend et la base.
5. Soumettre une pull request claire et documentée.

 XII.2 Pistes d'amélioration

- protéger réellement les routes d'administration ;
- ajouter des tests frontend/backend ;
- externaliser l'URL de l'API frontend dans une variable d'environnement ;
- corriger les problèmes d'encodage visibles dans certains fichiers ;
- séparer proprement frontend et backend si nécessaire.

 XIII. Licence

Aucune licence explicite n'est actuellement définie dans le dépôt.

Si le projet doit être diffusé publiquement, il est recommandé d'ajouter un fichier `LICENSE`.

 XIV. Contact

Projet académique ou personnel.

Renseignez ici les informations de contact souhaitées :

- Nom : MANDIMBIHARIMIADANA DENNIS LOUIS ROBERTO
- Email : mandimbiharimiadanadenis@gamil.com
- GitHub : Roberto_036