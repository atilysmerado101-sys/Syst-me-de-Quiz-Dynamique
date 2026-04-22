-- ──────────────────────────────────────────────────────────────
--  FICHIER SQL N°2 : AJOUT DE 30 NOUVELLES QUESTIONS
--  Thèmes : Capitales, Histoire, Sciences, Géographie, Films, Acteurs, Séries, Répliques
--  Structure conservée à l'identique du fichier original.
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
(1, 'Quelle est la capitale de la Turquie ?','["Istanbul","Ankara","Izmir","Antalya"]', 1,
    'Ankara est la capitale depuis 1923, remplaçant Istanbul après la fondation de la République.', 'moyen', 10),

(1, 'Quelle est la capitale de la Suisse ?',
    '["Zurich","Genève","Berne","Bâle"]', 2,
    'Berne est la "ville fédérale", capitale de facto de la Suisse, choisie pour sa position centrale.', 'moyen', 10),

(1, 'Quelle est la capitale du Vietnam ?',
    '["Ho Chi Minh-Ville","Hanoï","Da Nang","Hai Phong"]', 1,
    'Hanoï est la capitale du Vietnam depuis 1010, bien qu''Ho Chi Minh-Ville soit plus peuplée.', 'difficile', 15),

(1, 'Quelle est la capitale de l''Afrique du Sud ?',
    '["Johannesburg","Le Cap","Pretoria","Durban"]', 2,
    'L''Afrique du Sud a trois capitales : Pretoria (administrative), Le Cap (législative) et Bloemfontein (judiciaire).', 'difficile', 15);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Histoire (Thème 2)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(2, 'Qui était le premier empereur de Chine ?',
    '["Han Wudi","Qin Shi Huang","Sun Tzu","Confucius"]', 1,
    'Qin Shi Huang unifia la Chine en 221 av. J.-C. et ordonna la construction de la Grande Muraille et du mausolée de l''armée de terre cuite.', 'moyen', 10),

(2, 'En quelle année le mur de Berlin est-il tombé ?',
    '["1987","1988","1989","1990"]', 2,
    'Le mur de Berlin est tombé le 9 novembre 1989, symbole de la fin de la Guerre Froide.', 'moyen', 10),

(2, 'Quel célèbre navire a coulé lors de son premier voyage en 1912 ?',
    '["Lusitania","Titanic","Britannic","Queen Mary"]', 1,
    'Le RMS Titanic a heurté un iceberg dans la nuit du 14 au 15 avril 1912.', 'facile', 10),

(2, 'Qui était le dieu grec de la mer et des océans ?',
    '["Zeus","Hadès","Poséidon","Apollon"]', 2,
    'Poséidon, frère de Zeus et d''Hadès, régnait sur les mers avec son trident.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Sciences (Thème 3)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(3, 'Quelle est la plus petite planète du système solaire ?',
    '["Mars","Vénus","Mercure","Pluton"]', 2,
    'Mercure est la planète la plus petite et la plus proche du Soleil (Pluton étant classée comme planète naine).', 'facile', 10),

(3, 'Combien d''os compte le corps humain adulte ?',
    '["186","206","216","256"]', 1,
    'Le squelette adulte compte 206 os (un bébé en a environ 300 à la naissance qui fusionnent).', 'moyen', 10),

(3, 'Quel scientifique a formulé la théorie de la relativité générale ?',
    '["Isaac Newton","Albert Einstein","Stephen Hawking","Galilée"]', 1,
    'Albert Einstein publia la théorie de la relativité générale en 1915, révolutionnant la physique.', 'facile', 10),

(3, 'Quel est le nom du phénomène où la Lune passe entre la Terre et le Soleil ?',
    '["Éclipse lunaire","Éclipse solaire","Marée haute","Solstice"]', 1,
    'Une éclipse solaire se produit lorsque la Lune occulte le Soleil, projetant une ombre sur la Terre.', 'facile', 10),

(3, 'Quel est le métal liquide à température ambiante ?',
    '["Mercure","Gallium","Césium","Brome"]', 0,
    'Le mercure (Hg) est le seul métal liquide dans des conditions normales de température et de pression.', 'difficile', 15);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Géographie (Thème 4)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(4, 'Quel est le plus petit État indépendant du monde ?',
    '["Monaco","Vatican","Nauru","Saint-Marin"]', 1,
    'Le Vatican ne fait que 0,44 km² et compte environ 800 habitants.', 'moyen', 10),

(4, 'Quelle chaîne de montagnes sépare l''Europe de l''Asie en Russie ?',
    '["Alpes","Caucase","Oural","Himalaya"]', 2,
    'Les monts Oural sont traditionnellement considérés comme la frontière naturelle entre l''Europe et l''Asie.', 'difficile', 15),

(4, 'Dans quel pays trouve-t-on la région de la Cappadoce, célèbre pour ses cheminées de fées ?',
    '["Grèce","Turquie","Iran","Bulgarie"]', 1,
    'La Cappadoce est une région semi-aride du centre de la Turquie, connue pour ses formations rocheuses uniques.', 'moyen', 10),

(4, 'Quel est le fleuve qui traverse Londres ?',
    '["Seine","Tamise","Rhin","Danube"]', 1,
    'La Tamise (Thames) traverse Londres sur 346 km jusqu''à la mer du Nord.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Deviner le film (Thème 5)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(5, 'Dans quel film Jack Nicholson incarne-t-il un écrivain fou dans un hôtel isolé ?',
    '["Vol au-dessus d''un nid de coucou","The Shining","Les Infiltrés","Chinatown"]', 1,
    'The Shining (1980) de Stanley Kubrick est adapté du roman de Stephen King.', 'facile', 10),

(5, 'Quel film de science-fiction se déroule sur la planète Pandora et met en scène les Na''vi ?',
    '["Avatar","Interstellar","Star Wars","Dune"]', 0,
    'Avatar (2009) de James Cameron est le plus grand succès mondial de l''histoire du cinéma (hors inflation).', 'facile', 10),

(5, 'Dans quel film Tom Hanks reste-t-il bloqué seul sur une île déserte avec un ballon nommé Wilson ?',
    '["Cast Away (Seul au monde)","Apollo 13","Le Terminal","Sully"]', 0,
    'Cast Away (2000) a valu à Tom Hanks une nomination aux Oscars pour sa performance.', 'facile', 10),

(5, 'Quel film de Christopher Nolan suit un voleur qui infiltre les rêves ?',
    '["Tenet","Inception","Memento","The Dark Knight Rises"]', 1,
    'Inception (2010) explore la manipulation des rêves et se termine sur un plan ambigu de la toupie.', 'moyen', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Acteurs célèbres (Thème 6)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(6, 'Quel acteur a interprété Jack Sparrow dans la saga Pirates des Caraïbes ?',
    '["Orlando Bloom","Johnny Depp","Geoffrey Rush","Javier Bardem"]', 1,
    'Johnny Depp a créé le personnage iconique de Jack Sparrow, inspiré de Keith Richards.', 'facile', 10),

(6, 'Qui incarne James Bond dans "Skyfall" et "Spectre" ?',
    '["Sean Connery","Pierce Brosnan","Daniel Craig","Roger Moore"]', 2,
    'Daniel Craig a joué l''agent 007 dans cinq films, de Casino Royale (2006) à Mourir peut attendre (2021).', 'facile', 10),

(6, 'Quelle actrice a remporté l''Oscar de la meilleure actrice pour son rôle dans "La La Land" ?',
    '["Meryl Streep","Emma Stone","Jennifer Lawrence","Natalie Portman"]', 1,
    'Emma Stone a remporté l''Oscar en 2017 pour son interprétation de Mia, une aspirante actrice.', 'moyen', 10),

(6, 'Qui joue le rôle principal de John Wick ?',
    '["Denzel Washington","Keanu Reeves","Liam Neeson","Matt Damon"]', 1,
    'Keanu Reeves incarne le légendaire tueur à gages John Wick dans la franchise d''action éponyme.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Séries populaires (Thème 7)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(7, 'Quelle série met en scène la famille Byrde et un cartel mexicain dans les monts Ozark ?',
    '["Ozark","Breaking Bad","Narcos","Better Call Saul"]', 0,
    'Ozark (Netflix) suit Marty Byrde, conseiller financier qui blanchit de l''argent pour un cartel.', 'moyen', 10),

(7, 'Dans quelle série dystopique les participants jouent-ils à "1, 2, 3, Soleil" pour survivre ?',
    '["Alice in Borderland","Squid Game","Black Mirror","Westworld"]', 1,
    'Squid Game (Le Jeu du Calmar, 2021) est un phénomène sud-coréen diffusé sur Netflix.', 'facile', 10),

(7, 'Quel est le métier principal des personnages de "The Big Bang Theory" ?',
    '["Médecins","Avocats","Scientifiques","Professeurs de sport"]', 2,
    'Sheldon, Leonard, Raj et Howard travaillent tous à Caltech (physique, ingénierie spatiale, astrophysique).', 'facile', 10),

(7, 'Quelle série HBO suit le quotidien de quatre amies new-yorkaises dans les années 90-2000 ?',
    '["Friends","Sex and the City","Girls","Desperate Housewives"]', 1,
    'Sex and the City, avec Sarah Jessica Parker, a révolutionné la représentation des femmes célibataires à la télévision.', 'facile', 10);

-- ──────────────────────────────────────────────────────────────
--  NOUVELLES DONNÉES : Questions — Répliques cultes (Thème 8)
-- ──────────────────────────────────────────────────────────────
INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points) VALUES
(8, 'Dans quel film Al Pacino dit-il : « Garde tes amis près de toi, mais tes ennemis encore plus près » ?',
    '["Le Parrain 2","Scarface","Heat","L''Impasse"]', 0,
    'Michael Corleone prononce cette phrase mythique dans Le Parrain 2 (1974) de Francis Ford Coppola.', 'moyen', 10),

(8, 'De quel film est issue la réplique « Je suis le roi du monde ! » ?',
    '["Titanic","Avatar","Braveheart","Gladiator"]', 0,
    'Leonardo DiCaprio crie cette phrase à la proue du navire dans Titanic (1997) de James Cameron.', 'facile', 10),

(8, 'Quel personnage de Star Wars dit : « Je suis ton père » ?',
    '["Obi-Wan Kenobi","Dark Vador","L''Empereur","Yoda"]', 1,
    'Dark Vador révèle sa parenté à Luke Skywalker dans L''Empire contre-attaque (1980). La réplique exacte est "Non, je suis ton père".', 'facile', 10),

(8, 'Dans "Le Seigneur des Anneaux", comment Gollum appelle-t-il l''Anneau Unique ?',
    '["Le Trésor","Mon Trésor","Le Précieux","Mon Bijou"]', 2,
    'Gollum (Sméagol) désigne l''Anneau par "Mon Précieux", obsédé par lui depuis des siècles.', 'facile', 10),

(8, 'Quel célèbre robot dit : « R2-D2, où es-tu ? ... Ce n''est pas vrai ! Il m''arrive toujours la même chose ! » ?',
    '["C-3PO","Wall-E","Baymax","BB-8"]', 0,
    'C-3PO, le droïde protocolaire doré, se plaint régulièrement de sa malchance dans la saga Star Wars.', 'moyen', 10);