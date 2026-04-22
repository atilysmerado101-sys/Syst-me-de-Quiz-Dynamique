-- ============================================================
--  QuizDynamo — Schéma MySQL + Données initiales
--  Créé pour : mini-projet POO sur Plateforme à Composants
-- ============================================================

CREATE DATABASE IF NOT EXISTS quiz_dynamique CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_dynamique;

-- ──────────────────────────────────────────────────────────────
--  TABLE : themes
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS themes (
  id          INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100)     NOT NULL,
  icone       VARCHAR(20)      NOT NULL DEFAULT '❓',
  couleur     VARCHAR(7)       NOT NULL DEFAULT '#6366f1',
  description TEXT,
  ordre       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  actif       TINYINT(1)       NOT NULL DEFAULT 1,
  cree_le     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  TABLE : questions
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  theme_id         INT UNSIGNED     NOT NULL,
  question         TEXT             NOT NULL,
  -- Tableau JSON des 4 choix : ["opt0","opt1","opt2","opt3"]
  options          JSON             NOT NULL,
  -- Index (0-3) de la bonne réponse
  reponse_correcte TINYINT UNSIGNED NOT NULL,
  explication      TEXT,
  difficulte       ENUM('facile','moyen','difficile') NOT NULL DEFAULT 'moyen',
  points           SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  actif            TINYINT(1)        NOT NULL DEFAULT 1,
  cree_le          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_q_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  TABLE : utilisateurs
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS utilisateurs (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  nom_utilisateur  VARCHAR(50)      NOT NULL UNIQUE,
  email            VARCHAR(100)     NOT NULL UNIQUE,
  mot_de_passe     VARCHAR(255)     NOT NULL,
  identiter             ENUM('joueur','admin') NOT NULL DEFAULT 'joueur',
  actif            TINYINT(1)       NOT NULL DEFAULT 1,
  cree_le          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  derniere_connexion TIMESTAMP      NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  TABLE : step
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS step (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id   INT UNSIGNED,
  pseudo           VARCHAR(60)      NOT NULL DEFAULT 'Anonyme',
  -- Tableau JSON des IDs de thèmes sélectionnés
  theme_ids        JSON,
  nb_questions     TINYINT UNSIGNED NOT NULL DEFAULT 10,
  difficulte       VARCHAR(20)      NOT NULL DEFAULT 'mixte',
  score            SMALLINT UNSIGNED,
  nb_correctes     TINYINT UNSIGNED,
  duree_secondes   SMALLINT UNSIGNED,
  -- Tableau JSON des réponses données
  reponses         JSON,
  date_debut       DATETIME         NOT NULL,
  date_fin         DATETIME,
  CONSTRAINT fk_s_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  TABLE : resultats  (détail par réponse)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resultats (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  step_id       INT UNSIGNED     NOT NULL,
  question_id      INT UNSIGNED     NOT NULL,
  reponse_donnee   TINYINT,          -- NULL si timeout
  is_correct       TINYINT(1)       NOT NULL DEFAULT 0,
  points_gagnes    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  temps_reponse    SMALLINT UNSIGNED,  -- secondes
  cree_le          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_r_step  FOREIGN KEY (step_id)  REFERENCES step(id)  ON DELETE CASCADE,
  CONSTRAINT fk_r_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ──────────────────────────────────────────────────────────────
--  TABLE : scores
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id   INT UNSIGNED     NOT NULL,
  step_id       INT UNSIGNED     NOT NULL,
  score            SMALLINT UNSIGNED NOT NULL,
  nb_questions     TINYINT UNSIGNED NOT NULL,
  duree_secondes   SMALLINT UNSIGNED,
  date_jouee       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_y_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  CONSTRAINT fk_s_step     FOREIGN KEY (step_id)     REFERENCES step(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  INDEX
-- ──────────────────────────────────────────────────────────────
CREATE INDEX idx_p_theme      ON questions (theme_id, actif);
CREATE INDEX idx_p_diff       ON questions (difficulte, actif);
CREATE INDEX idx_r_step    ON resultats  (step_id);
CREATE INDEX idx_s_score      ON step   (score DESC);
CREATE INDEX idx_u_email      ON utilisateurs (email);
CREATE INDEX idx_u_username   ON utilisateurs (nom_utilisateur);
CREATE INDEX idx_scores_user  ON scores (utilisateur_id, score DESC);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Thèmes
-- ──────────────────────────────────────────────────────────────
INSERT INTO themes (id, nom, icone, couleur, description, ordre) VALUES
(1, 'Capitales du monde', '🌍', '#2563eb', 'Testez vos connaissances sur les capitales du monde entier.',   1),
(2, 'Histoire',           '📜', '#7c3aed', 'Des grandes batailles à la naissance des civilisations.',        2),
(3, 'Sciences',           '🔬', '#059669', 'Physique, chimie, biologie et bien plus encore.',                3),
(4, 'Géographie',         '🗺️', '#0891b2', 'Montagnes, fleuves, pays et records géographiques.',            4),
(5, 'Deviner le film',    '🎬', '#dc2626', 'Identifiez le film derrière les indices proposés.',              5),
(6, 'Acteurs célèbres',   '🎭', '#d97706', 'Stars de Hollywood et du cinéma international.',                 6),
(7, 'Séries populaires',  '📺', '#9333ea', 'Les séries qui ont marqué la culture populaire.',                7),
(8, 'Répliques cultes',   '💬', '#0f766e', 'Retrouvez l\'origine des citations les plus mémorables.',       8);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Capitales du monde
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(1, 'Quelle est la capitale de l\'Australie ?',
    '["Sydney","Melbourne","Canberra","Brisbane"]', 2,
    'Canberra est la capitale fédérale depuis 1913, choisie comme compromis entre Sydney et Melbourne.', 'moyen', 10),

(1, 'Quelle est la capitale du Canada ?',
    '["Toronto","Ottawa","Montréal","Vancouver"]', 1,
    'Ottawa est la capitale fédérale depuis la Confédération de 1867.', 'facile', 10),

(1, 'Quelle est la capitale du Brésil ?',
    '["Rio de Janeiro","São Paulo","Brasília","Salvador"]', 2,
    'Brasília est la capitale depuis 1960, construite de zéro en plein centre du pays.', 'moyen', 10),

(1, 'Quelle est la capitale de la Nouvelle-Zélande ?',
    '["Auckland","Wellington","Christchurch","Dunedin"]', 1,
    'Wellington, à la pointe sud de l\'île du Nord, est capitale depuis 1865.', 'moyen', 10),

(1, 'Quelle est la capitale de l\'Inde ?',
    '["Mumbai","Kolkata","Bangalore","New Delhi"]', 3,
    'New Delhi est la capitale de l\'Inde depuis 1911, quand les Britanniques l\'ont déplacée de Calcutta.', 'facile', 10),

(1, 'Quelle est la capitale du Kazakhstan ?',
    '["Almaty","Astana","Shymkent","Karaganda"]', 1,
    'Astana (anciennement Nur-Sultan puis Astana à nouveau) est la capitale depuis 1997.', 'difficile', 15),

(1, 'Quelle est la capitale de la Tanzanie ?',
    '["Dar es Salaam","Dodoma","Zanzibar","Mwanza"]', 1,
    'Dodoma est la capitale officielle de la Tanzanie depuis 1996, bien que Dar es Salaam reste la plus grande ville.', 'difficile', 15);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Histoire
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(2, 'En quelle année a eu lieu la Révolution française ?',
    '["1776","1789","1815","1848"]', 1,
    'La Révolution française débute le 14 juillet 1789 avec la prise de la Bastille.', 'facile', 10),

(2, 'Qui a découvert l\'Amérique en 1492 ?',
    '["Vasco de Gama","Magellan","Christophe Colomb","Amerigo Vespucci"]', 2,
    'Christophe Colomb, financé par les Rois Catholiques d\'Espagne, atteignit les Bahamas le 12 octobre 1492.', 'facile', 10),

(2, 'Quel empire était dirigé par Gengis Khan ?',
    '["Ottoman","Mongol","Perse","Roman"]', 1,
    'Gengis Khan fonda l\'Empire mongol, le plus grand empire terrestre continu de l\'histoire.', 'facile', 10),

(2, 'En quelle année fut signé l\'Armistice de la Première Guerre mondiale ?',
    '["1916","1917","1918","1919"]', 2,
    'L\'Armistice fut signé le 11 novembre 1918 à 11h, dans un wagon à Compiègne.', 'moyen', 10),

(2, 'Qui était le pharaon lors de la construction de la Grande Pyramide de Gizeh ?',
    '["Ramsès II","Toutânkhamon","Khéops","Cléopâtre"]', 2,
    'La Grande Pyramide fut construite vers 2560 av. J.-C. par le pharaon Khéops (Khufou).', 'moyen', 10),

(2, 'Quel événement a déclenché la Première Guerre mondiale ?',
    '["L\'invasion de la Belgique","L\'assassinat de François-Ferdinand","La mobilisation russe","Le traité de Versailles"]', 1,
    'L\'assassinat de l\'archiduc François-Ferdinand à Sarajevo le 28 juin 1914 déclencha la guerre.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Sciences
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(3, 'Quel est le symbole chimique de l\'or ?',
    '["Go","Au","Ag","Or"]', 1,
    'Au vient du latin "Aurum". L\'or est l\'élément n°79 du tableau périodique.', 'facile', 10),

(3, 'Combien de chromosomes possède l\'être humain ?',
    '["23","44","46","48"]', 2,
    'Les humains ont 46 chromosomes, organisés en 23 paires.', 'moyen', 10),

(3, 'Quelle est la vitesse de la lumière dans le vide ?',
    '["300 000 km/s","150 000 km/s","450 000 km/s","200 000 km/s"]', 0,
    'La vitesse de la lumière est exactement 299 792 458 m/s, soit ≈ 300 000 km/s.', 'moyen', 10),

(3, 'Qui a découvert la pénicilline ?',
    '["Marie Curie","Louis Pasteur","Alexander Fleming","Robert Koch"]', 2,
    'Alexander Fleming découvrit la pénicilline en 1928 en observant une moisissure Penicillium.', 'facile', 10),

(3, 'Quel élément est le plus abondant dans l\'atmosphère terrestre ?',
    '["Oxygène","Azote","Argon","CO₂"]', 1,
    'L\'azote (N₂) représente ~78 % de l\'atmosphère terrestre, l\'oxygène ~21 %.', 'moyen', 10),

(3, 'Quelle est la formule chimique de l\'eau ?',
    '["HO","H₂O","H₃O","H₂O₂"]', 1,
    'L\'eau (H₂O) est composée de deux atomes d\'hydrogène et un d\'oxygène.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Géographie
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(4, 'Quel est le plus long fleuve du monde ?',
    '["Amazone","Congo","Nil","Mississippi"]', 2,
    'Le Nil (6 650 km) est généralement reconnu comme le plus long fleuve du monde.', 'facile', 10),

(4, 'Quel est le plus grand pays du monde ?',
    '["Canada","Chine","États-Unis","Russie"]', 3,
    'La Russie couvre 17,1 millions de km², faisant de loin le plus grand pays.', 'facile', 10),

(4, 'Quelle est la plus haute montagne du monde ?',
    '["K2","Mont Blanc","Everest","Kilimanjaro"]', 2,
    'L\'Everest culmine à 8 848,86 m, à la frontière entre le Népal et la Chine.', 'facile', 10),

(4, 'Quel désert est le plus grand du monde ?',
    '["Sahara","Gobi","Antarctique","Arabian"]', 2,
    'L\'Antarctique est le plus grand désert (14,2 M km²) — un désert froid quasi sans précipitations.', 'difficile', 15),

(4, 'Quel océan est le plus grand ?',
    '["Atlantique","Pacifique","Indien","Arctique"]', 1,
    'L\'océan Pacifique couvre environ 165 millions de km², soit plus de la moitié des océans du monde.', 'facile', 10),

(4, 'Sur quel continent se trouve le lac Victoria ?',
    '["Asie","Amérique du Sud","Afrique","Océanie"]', 2,
    'Le lac Victoria, le plus grand lac d\'Afrique, est à la frontière de la Tanzanie, du Kenya et de l\'Ouganda.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Deviner le film
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(5, 'Dans quel film trouve-t-on la réplique «\u202fJe serai de retour\u202f» (I\'ll be back) ?',
    '["RoboCop","Predator","Terminator","Total Recall"]', 2,
    'Arnold Schwarzenegger prononce cette réplique culte dans Terminator (1984) de James Cameron.', 'facile', 10),

(5, 'Quel film met en scène un requin géant terrorisant une station balnéaire ?',
    '["Deep Blue Sea","The Meg","Piranha","Jaws (Les Dents de la mer)"]', 3,
    'Jaws (Les Dents de la mer, 1975) de Steven Spielberg est le film fondateur du blockbuster estival.', 'facile', 10),

(5, 'Dans quel film Neo doit-il choisir entre pilule rouge et pilule bleue ?',
    '["Inception","The Matrix","Interstellar","Dark City"]', 1,
    'Dans Matrix (1999) des Wachowski, Neo prend la pilule rouge et découvre la réalité.', 'facile', 10),

(5, 'Quel film d\'animation Disney met en scène un lion royal nommé Simba ?',
    '["Bambi","Le Roi Lion","Tarzan","Le Livre de la Jungle"]', 1,
    'Le Roi Lion (1994) est inspiré de Hamlet et est l\'un des plus grands succès de Disney.', 'facile', 10),

(5, 'Qui réalise le film Pulp Fiction sorti en 1994 ?',
    '["Martin Scorsese","David Fincher","Quentin Tarantino","Joel Coen"]', 2,
    'Pulp Fiction est l\'œuvre signature de Quentin Tarantino, palme d\'or à Cannes en 1994.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Acteurs célèbres
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(6, 'Quel acteur joue Tony Stark / Iron Man dans le MCU ?',
    '["Chris Evans","Chris Hemsworth","Robert Downey Jr.","Benedict Cumberbatch"]', 2,
    'Robert Downey Jr. a incarné Tony Stark de 2008 (Iron Man) à 2019 (Avengers: Endgame).', 'facile', 10),

(6, 'Qui joue Hermione Granger dans la saga Harry Potter ?',
    '["Helena Bonham Carter","Emma Thompson","Emma Watson","Keira Knightley"]', 2,
    'Emma Watson a joué Hermione Granger dans les 8 films Harry Potter, de 2001 à 2011.', 'facile', 10),

(6, 'Quel acteur a joué le Joker dans The Dark Knight (2008) ?',
    '["Jared Leto","Joaquin Phoenix","Jack Nicholson","Heath Ledger"]', 3,
    'Heath Ledger a remporté l\'Oscar à titre posthume pour son rôle de Joker.', 'facile', 10),

(6, 'Quel acteur a joué Forrest Gump ?',
    '["Jeff Bridges","Kevin Costner","Tom Hanks","Tom Cruise"]', 2,
    'Tom Hanks a remporté l\'Oscar du meilleur acteur pour ce rôle en 1995.', 'facile', 10),

(6, 'Qui joue Katniss Everdeen dans Hunger Games ?',
    '["Kristen Stewart","Shailene Woodley","Jennifer Lawrence","Saoirse Ronan"]', 2,
    'Jennifer Lawrence a incarné Katniss Everdeen dans les 4 films Hunger Games (2012-2015).', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Séries populaires
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(7, 'Dans quelle série trouve-t-on Jon Snow et Daenerys Targaryen ?',
    '["The Witcher","Game of Thrones","Vikings","Outlander"]', 1,
    'Game of Thrones (2011-2019) est une série épique de fantasy diffusée sur HBO.', 'facile', 10),

(7, 'Qui est le chimiste qui devient dealer dans Breaking Bad ?',
    '["Walter White","Jesse Pinkman","Hank Schrader","Gustavo Fring"]', 0,
    'Walter White, alias Heisenberg, est joué par Bryan Cranston dans Breaking Bad.', 'facile', 10),

(7, 'Quelle série suit une famille royale britannique contemporaine ?',
    '["Downton Abbey","Peaky Blinders","The Crown","Victoria"]', 2,
    'The Crown (depuis 2016) sur Netflix retrace le règne d\'Elizabeth II.', 'facile', 10),

(7, 'Dans quelle ville se déroule la série Stranger Things ?',
    '["Springfield","Hawkins","Riverdale","Sunnydale"]', 1,
    'Stranger Things se déroule à Hawkins, Indiana, dans les années 1980.', 'facile', 10),

(7, 'Combien de saisons comporte la série Friends ?',
    '["8","9","10","12"]', 2,
    'Friends a duré 10 saisons, de 1994 à 2004, sur la chaîne NBC.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  DONNÉES : Questions — Répliques cultes
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(8, 'À quelle saga appartient «\u202fQue la Force soit avec toi\u202f» ?',
    '["Star Trek","Star Wars","Dune","Avatar"]', 1,
    'Cette phrase iconique de Star Wars est devenue un symbole culturel depuis 1977.', 'facile', 10),

(8, 'De quel film vient «\u202fTu parles à moi ?\u202f» (You talkin\' to me?)',
    '["Scarface","Goodfellas","Raging Bull","Taxi Driver"]', 3,
    'Robert De Niro improvise cette réplique culte dans Taxi Driver (1976) de Martin Scorsese.', 'moyen', 10),

(8, 'Quelle réplique termine : «\u202fÀ l\'infini… et\u202f» ?',
    '["par-delà les étoiles","au-delà des limites","au-delà !","et plus encore"]', 2,
    '«\u202fÀ l\'infini et au-delà\u202f!» est la devise de Buzz l\'Éclair dans Toy Story (1995).', 'facile', 10),

(8, 'Dans quel film entend-on «\u202fHasta la vista, baby\u202f» ?',
    '["Total Recall","Predator","Terminator 2","Commando"]', 2,
    'Arnold Schwarzenegger prononce cette réplique dans Terminator 2 (1991) avant d\'éliminer le T-1000.', 'facile', 10),

(8, 'Complète la réplique de Forrest Gump : «\u202fLa vie c\'est comme une boîte de…\u202f»',
    '["pralines","chocolats","surprises","bonbons"]', 1,
    '«\u202fLa vie c\'est comme une boîte de chocolats, on ne sait jamais sur quoi on va tomber.\u202f» — Forrest Gump (1994).', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  VUE : Classement simplifié
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_classement AS
SELECT
  pseudo,
  score,
  nb_correctes,
  nb_questions,
  ROUND(nb_correctes / nb_questions * 100, 1) AS taux_reussite,
  duree_secondes,
  date_debut
FROM step
WHERE score IS NOT NULL
ORDER BY score DESC, duree_secondes ASC;
