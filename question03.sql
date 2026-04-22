-- ──────────────────────────────────────────────────────────────
--  FICHIER SQL N°3 : AJOUT DE 30 NOUVELLES QUESTIONS
--  Thèmes : Capitales, Histoire, Sciences, Géographie, Films, Acteurs, Séries, Répliques
--  Structure strictement identique aux fichiers précédents.
-- ──────────────────────────────────────────────────────────────
-- ──────────────────────────────────────────────────────────────
--  TABLE : resultats (détail par réponse)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resultats (
  id               INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  step_id          INT UNSIGNED     NOT NULL,
  question_id      INT UNSIGNED     NOT NULL,
  reponse_donnee   TINYINT,          -- NULL si timeout
  is_correct       TINYINT(1)       NOT NULL DEFAULT 0,
  points_gagnes    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  temps_reponse    SMALLINT UNSIGNED,  -- secondes
  cree_le          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_r_step     FOREIGN KEY (step_id)     REFERENCES step(id)      ON DELETE CASCADE,
  CONSTRAINT fk_r_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Capitales du monde (Thème 1)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(1, 'Quelle est la capitale de l''Argentine ?',
    '["Buenos Aires","Córdoba","Rosario","Mendoza"]', 0,
    'Buenos Aires est la capitale et la plus grande ville d''Argentine, située sur la rive ouest du Río de la Plata.', 'facile', 10),

(1, 'Quelle est la capitale de la Thaïlande ?',
    '["Phuket","Chiang Mai","Bangkok","Pattaya"]', 2,
    'Bangkok (Krung Thep Maha Nakhon en thaï) est la capitale depuis 1782, connue pour ses temples et sa vie nocturne animée.', 'moyen', 10),

(1, 'Quelle est la capitale des Pays-Bas ?',
    '["La Haye","Rotterdam","Utrecht","Amsterdam"]', 3,
    'Amsterdam est la capitale constitutionnelle, bien que le gouvernement et le parlement siègent à La Haye.', 'facile', 10),

(1, 'Quelle est la capitale du Pérou ?',
    '["Cusco","Arequipa","Lima","Trujillo"]', 2,
    'Lima fut fondée par Francisco Pizarro en 1535 comme "Cité des Rois" et est aujourd''hui une métropole de 10 millions d''habitants.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Histoire (Thème 2)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(2, 'Quelle civilisation a construit le Machu Picchu ?',
    '["Aztèques","Mayas","Incas","Olmèques"]', 2,
    'Les Incas ont construit cette citadelle au XVe siècle dans les Andes péruviennes, redécouverte en 1911.', 'moyen', 10),

(2, 'En quelle année l''homme a-t-il marché sur la Lune pour la première fois ?',
    '["1965","1969","1972","1975"]', 1,
    'Le 21 juillet 1969, Neil Armstrong et Buzz Aldrin (mission Apollo 11) sont devenus les premiers humains à marcher sur la Lune.', 'facile', 10),

(2, 'Quel roi de France était surnommé "Le Roi Soleil" ?',
    '["François Ier","Henri IV","Louis XIV","Louis XVI"]', 2,
    'Louis XIV régna 72 ans (1643-1715), bâtit Versailles et incarna l''absolutisme monarchique.', 'facile', 10),

(2, 'Quel empire était dirigé par Jules César ?',
    '["Empire grec","Empire romain","Empire byzantin","Empire ottoman"]', 1,
    'Jules César fut un général et homme d''État de la République romaine avant l''instauration de l''Empire par Auguste.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Sciences (Thème 3)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(3, 'Quel gaz les plantes absorbent-elles principalement pour la photosynthèse ?',
    '["Oxygène","Azote","Dioxyde de carbone","Hydrogène"]', 2,
    'Les plantes utilisent le CO₂, l''eau et la lumière solaire pour produire du glucose et de l''oxygène.', 'facile', 10),

(3, 'Quel est le plus gros organe du corps humain ?',
    '["Le foie","La peau","Les poumons","Le cœur"]', 1,
    'La peau est le plus grand organe, représentant environ 15% du poids corporel total et mesurant près de 2 m².', 'moyen', 10),

(3, 'Quelle est la planète la plus chaude du système solaire ?',
    '["Mercure","Vénus","Mars","Jupiter"]', 1,
    'Vénus, avec son atmosphère épaisse de CO₂ créant un effet de serre intense, atteint 460°C en surface (plus que Mercure).', 'moyen', 10),

(3, 'Quelle particule subatomique a une charge positive ?',
    '["Électron","Neutron","Proton","Photon"]', 2,
    'Le proton, présent dans le noyau atomique, porte une charge électrique positive.', 'facile', 10),

(3, 'Qui est considéré comme le père de la théorie de l''évolution ?',
    '["Gregor Mendel","Charles Darwin","Louis Pasteur","Alfred Wallace"]', 1,
    'Charles Darwin publia "L''Origine des espèces" en 1859, proposant la sélection naturelle comme mécanisme de l''évolution.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Géographie (Thème 4)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(4, 'Quel pays possède le plus grand nombre d''îles au monde ?',
    '["Indonésie","Philippines","Suède","Canada"]', 2,
    'La Suède compte plus de 267 000 îles, dont seulement environ 1 000 sont habitées.', 'difficile', 15),

(4, 'Quelle mer est la plus salée du monde ?',
    '["Mer Méditerranée","Mer Morte","Mer Rouge","Océan Atlantique"]', 1,
    'La Mer Morte, située entre Israël, la Jordanie et la Palestine, a une salinité d''environ 34% (près de 10 fois celle des océans).', 'moyen', 10),

(4, 'Quel est le point culminant de l''Afrique ?',
    '["Mont Kenya","Mont Kilimandjaro","Mont Stanley","Mont Cameroun"]', 1,
    'Le Kilimandjaro, en Tanzanie, culmine à 5 895 mètres et est le plus haut volcan dormant d''Afrique.', 'moyen', 10),

(4, 'Quelle est la capitale de l''État de New York (pas la ville) ?',
    '["New York City","Buffalo","Albany","Rochester"]', 2,
    'Albany est la capitale de l''État de New York depuis 1797, située sur le fleuve Hudson.', 'difficile', 15);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Deviner le film (Thème 5)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(5, 'Quel film de 1993 met en scène un T-Rex et des vélociraptors dans un parc d''attractions ?',
    '["King Kong","Jurassic Park","Godzilla","Le Monde perdu"]', 1,
    'Jurassic Park, réalisé par Steven Spielberg, a révolutionné les effets spéciaux avec ses dinosaures animatroniques et en images de synthèse.', 'facile', 10),

(5, 'Dans quel film d''animation une petite fille nommée Chihiro travaille-t-elle dans des bains pour esprits ?',
    '["Princesse Mononoké","Le Voyage de Chihiro","Ponyo","Le Château ambulant"]', 1,
    '"Le Voyage de Chihiro" (2001) de Hayao Miyazaki a remporté l''Oscar du meilleur film d''animation.', 'moyen', 10),

(5, 'Quel film de guerre se déroule sur la plage d''Omaha Beach le 6 juin 1944 ?',
    '["Dunkerque","Il faut sauver le soldat Ryan","La Ligne rouge","Fury"]', 1,
    '"Il faut sauver le soldat Ryan" (1998) de Spielberg est célèbre pour sa reconstitution brutale et réaliste du Débarquement.', 'moyen', 10),

(5, 'Quel film de 1994 suit un homme innocent condamné à perpétuité qui s''évade à l''aide d''un poster ?',
    '["Le Fugitif","Les Évadés","La Ligne verte","Shawshank Redemption"]', 3,
    'Shawshank Redemption (Les Évadés), adapté de Stephen King, est souvent classé n°1 des meilleurs films sur IMDb.', 'moyen', 10),

(5, 'Qui réalise le film d''horreur "Get Out" (2017) ?',
    '["James Wan","Ari Aster","Jordan Peele","Robert Eggers"]', 2,
    'Jordan Peele a remporté l''Oscar du meilleur scénario original pour ce film mêlant horreur et critique sociale.', 'difficile', 15);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Acteurs célèbres (Thème 6)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(6, 'Qui interprète le personnage de Wolverine dans la saga X-Men ?',
    '["Patrick Stewart","Ian McKellen","Hugh Jackman","James Marsden"]', 2,
    'Hugh Jackman a incarné Logan/Wolverine pendant 17 ans, de 2000 (X-Men) à 2017 (Logan).', 'facile', 10),

(6, 'Quelle actrice est devenue célèbre pour son rôle de Rachel Green dans "Friends" ?',
    '["Courteney Cox","Lisa Kudrow","Jennifer Aniston","Reese Witherspoon"]', 2,
    'Jennifer Aniston a joué Rachel Green pendant les 10 saisons de la série culte (1994-2004).', 'facile', 10),

(6, 'Qui a remporté l''Oscar du meilleur acteur pour son rôle dans "Le Discours d''un roi" ?',
    '["Colin Firth","Geoffrey Rush","Tom Hooper","Helena Bonham Carter"]', 0,
    'Colin Firth a remporté l''Oscar en 2011 pour son interprétation du roi George VI bègue.', 'moyen', 10),

(6, 'Quel acteur incarne le Joker dans le film "Joker" de 2019 ?',
    '["Jared Leto","Jack Nicholson","Heath Ledger","Joaquin Phoenix"]', 3,
    'Joaquin Phoenix a reçu l''Oscar du meilleur acteur pour sa performance intense et troublante dans ce film.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Séries populaires (Thème 7)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(7, 'Dans quelle série trouve-t-on les personnages de Sheldon Cooper et Penny ?',
    '["How I Met Your Mother","The Big Bang Theory","Young Sheldon","Modern Family"]', 1,
    'The Big Bang Theory (2007-2019) suit un groupe de scientifiques geeks et leur voisine aspirante actrice.', 'facile', 10),

(7, 'Quelle série suit la vie d''une famille d''agents secrets, les Jennings, dans l''Amérique des années 80 ?',
    '["Homeland","The Americans","24 heures chrono","Alias"]', 1,
    'The Americans (2013-2018) suit deux espions soviétiques se faisant passer pour un couple américain ordinaire.', 'difficile', 15),

(7, 'Quelle série se déroule principalement dans le Comté de Hawkins, Indiana ?',
    '["Riverdale","Twin Peaks","Stranger Things","Dark"]', 2,
    'Stranger Things mélange horreur surnaturelle et nostalgie des années 80 dans la petite ville fictive de Hawkins.', 'facile', 10),

(7, 'Quel est le nom du royaume fictif où se déroule la série "The Witcher" ?',
    '["Westeros","Narnia","Le Continent","La Terre du Milieu"]', 2,
    'L''action de The Witcher se déroule sur "Le Continent", créé par l''écrivain polonais Andrzej Sapkowski.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Répliques cultes (Thème 8)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(8, 'Quel personnage dit : « Ma précieuse » ?',
    '["Frodon Sacquet","Gollum / Sméagol","Bilbon Sacquet","Gandalf"]', 1,
    'Gollum, obsédé par l''Anneau Unique, l''appelle "ma précieuse" dans Le Seigneur des Anneaux.', 'facile', 10),

(8, 'À quel film appartient la réplique : « Houston, nous avons un problème » ?',
    '["Apollo 13","Interstellar","Seul sur Mars","Gravity"]', 0,
    'Cette phrase, devenue culte, est prononcée par l''équipage d''Apollo 13 lors de l''explosion d''un réservoir d''oxygène.', 'moyen', 10),

(8, 'Dans quel film entend-on : « On ne quitte pas la table avant d''avoir fini son assiette ! ... Je n''ai pas faim. ... Tu vas me le payer ! » ?',
    '["Les Goonies","Hook","Maman, j''ai raté l''avion !","Madame Doubtfire"]', 1,
    'Cette réplique culte est échangée entre le Capitaine Crochet et un enfant dans Hook (1991) de Steven Spielberg.', 'difficile', 15),

(8, 'Qui dit : « Je suis inévitable » dans Avengers: Endgame ?',
    '["Iron Man","Captain America","Thor","Thanos"]', 3,
    'Thanos prononce cette phrase menaçante avant de claquer des doigts, pensant sceller le sort de l''univers.', 'facile', 10),

(8, 'De quel film provient la citation : « On n''est pas sérieux quand on a 17 ans... » ?',
    '["Le Péril jeune","Les Quatre Cents Coups","Le Grand Bleu","Cyrano de Bergerac"]', 1,
    'Cette réplique est extraite du poème "Roman" d''Arthur Rimbaud, citée dans "Le Péril jeune" de Cédric Klapisch.', 'difficile', 15);