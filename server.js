// ============================================================
// QuizDynamo — Backend Node.js / Express
// ============================================================
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting — 100 req/min par IP
const limiter = rateLimit({ windowMs: 60_000, max: 100, message: { error: 'Trop de requêtes.' } });
app.use('/api/', limiter);

// ─── JWT Middleware ─────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || '9876543210';
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide.' });
    req.user = user;
    next();
  });
};

// ─── MySQL pool ───────────────────────────────────────────────
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'quiz_dynamique',
  waitForConnections: true,
  connectionLimit:    1000,
});

// ─── Helpers ──────────────────────────────────────────────────
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Routes ───────────────────────────────────────────────────

// GET /api/health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Authentification ─────────────────────────────────────────────
// POST /api/auth/register — inscription
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { nom_utilisateur, email, mot_de_passe } = req.body;
  if (!nom_utilisateur || !email || !mot_de_passe)
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });

  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  const [result] = await pool.query(
    'INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe) VALUES (?, ?, ?)',
    [nom_utilisateur, email, hashedPassword]
  );
  res.status(201).json({ success: true, id: result.insertId });
}));

// POST /api/auth/login — connexion
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe)
    return res.status(400).json({ error: 'Email et mot de passe requis.' });

  const [[user]] = await pool.query(
    'SELECT id, nom_utilisateur, email, mot_de_passe, identiter FROM utilisateurs WHERE email = ? AND actif = 1',
    [email]
  );
  if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé.' });

  const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!validPassword) return res.status(401).json({ error: 'Mot de passe incorrect.' });

  const token = jwt.sign({ id: user.id, nom_utilisateur: user.nom_utilisateur, identiter: user.identiter }, JWT_SECRET, { expiresIn: '24h' });
  await pool.query('UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?', [user.id]);

  res.json({ success: true, token, user: { id: user.id, nom_utilisateur: user.nom_utilisateur, identiter: user.identiter } });
}));

// GET /api/auth/me — vérifie le token et renvoie l'utilisateur connecté
app.get('/api/auth/me', authenticateToken, asyncHandler(async (req, res) => {
  const [[user]] = await pool.query(
    'SELECT id, nom_utilisateur, email, identiter FROM utilisateurs WHERE id = ? AND actif = 1',
    [req.user.id]
  );
  if (!user) return res.status(401).json({ error: 'Utilisateur introuvable ou inactif.' });
  res.json({ success: true, user });
}));

// GET /api/user/scores — historique des scores de l'utilisateur
app.get('/api/user/scores', authenticateToken, asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.score, s.nb_questions, s.duree_secondes, s.date_jouee
     FROM scores s
     WHERE s.utilisateur_id = ?
     ORDER BY s.date_jouee DESC`,
    [req.user.id]
  );
  res.json({ success: true, data: rows });
}));

// ── Thèmes ──────────────────────────────────────────────────────
// GET /api/themes — liste tous les thèmes actifs
app.get('/api/themes', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, nom, icone, couleur, description FROM themes WHERE actif = 1 ORDER BY ordre'
  );
  res.json({ success: true, data: rows });
}));

// GET /api/themes/:id — détail d'un thème + nb questions
app.get('/api/themes/:id', asyncHandler(async (req, res) => {
  const [[theme]] = await pool.query('SELECT * FROM themes WHERE id = ? AND actif = 1', [req.params.id]);
  if (!theme) return res.status(404).json({ error: 'Thème introuvable.' });

  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM questions WHERE theme_id = ? AND actif = 1', [req.params.id]
  );
  res.json({ success: true, data: { ...theme, total_questions: total } });
}));

// ── Questions ────────────────────────────────────────────────────
// GET /api/questions?themes=1,2&limit=10&difficulty=moyen
app.get('/api/questions', asyncHandler(async (req, res) => {
  const { themes, limit = 10, difficulty } = req.query;

  let sql = `
    SELECT q.id, q.question, q.options, q.reponse_correcte, q.explication,
           q.difficulte, q.points, t.nom AS theme_nom, t.icone AS theme_icone
    FROM questions q
    JOIN themes t ON t.id = q.theme_id
    WHERE q.actif = 1
  `;
  const params = [];

  if (themes) {
    const ids = themes.split(',').map(Number).filter(Boolean);
    if (ids.length) { sql += ` AND q.theme_id IN (${ids.map(() => '?').join(',')}) `; params.push(...ids); }
  }
  if (difficulty && difficulty !== 'mixte') {
    sql += ' AND q.difficulte = ? '; params.push(difficulty);
  }
  sql += ' ORDER BY RAND() LIMIT ?';
  params.push(Number(limit));

  const [rows] = await pool.query(sql, params);

  // Parse les options JSON stockées en base
  const questions = rows.map(r => ({
    ...r,
    options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
  }));

  res.json({ success: true, count: questions.length, data: questions });
}));

// GET /api/questions/:id
app.get('/api/questions/:id', asyncHandler(async (req, res) => {
  const [[row]] = await pool.query(
    `SELECT q.*, t.nom AS theme_nom, t.icone AS theme_icone
     FROM questions q JOIN themes t ON t.id = q.theme_id
     WHERE q.id = ? AND q.actif = 1`, [req.params.id]
  );
  if (!row) return res.status(404).json({ error: 'Question introuvable.' });
  row.options = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
  res.json({ success: true, data: row });
}));

// ── Sessions ─────────────────────────────────────────────────────
// POST /api/step — démarre une nouvelle step
app.post('/api/step', authenticateToken, asyncHandler(async (req, res) => {
  const { pseudo, theme_ids = [], nb_questions = 10, difficulte = 'mixte' } = req.body;
  const [result] = await pool.query(
    `INSERT INTO step (utilisateur_id, pseudo, theme_ids, nb_questions, difficulte, date_debut)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [req.user.id, pseudo || req.user.nom_utilisateur, JSON.stringify(theme_ids), nb_questions, difficulte]
  );
  res.status(201).json({ success: true, step_id: result.insertId });
}));

// PUT /api/step/:id/finish — termine une step
app.put('/api/step/:id/finish', authenticateToken, asyncHandler(async (req, res) => {
  const { score, nb_correctes, duree_secondes, reponses } = req.body;
  await pool.query(
    `UPDATE step
     SET score = ?, nb_correctes = ?, duree_secondes = ?, reponses = ?, date_fin = NOW()
     WHERE id = ? AND utilisateur_id = ?`,
    [score, nb_correctes, duree_secondes, JSON.stringify(reponses), req.params.id, req.user.id]
  );
  // Insert into scores table
  await pool.query(
    'INSERT INTO scores (utilisateur_id, step_id, score, nb_questions, duree_secondes) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, req.params.id, score, nb_correctes, duree_secondes]
  );
  res.json({ success: true });
}));

// ── Résultats ──────────────────────────────────────────────────────
// POST /api/resultats — valide les réponses d'une question
app.post('/api/resultats', asyncHandler(async (req, res) => {
  const { step_id, question_id, reponse_donnee, temps_reponse } = req.body;
  const [[q]] = await pool.query('SELECT reponse_correcte, points FROM questions WHERE id = ?', [question_id]);
  if (!q) return res.status(404).json({ error: 'Question introuvable.' });

  const is_correct = reponse_donnee === q.reponse_correcte;
  const points_gagnes = is_correct ? q.points : 0;

  await pool.query(
    `INSERT INTO resultats (step_id, question_id, reponse_donnee, is_correct, points_gagnes, temps_reponse)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [step_id, question_id, reponse_donnee, is_correct, points_gagnes, temps_reponse]
  );
  res.json({ success: true, is_correct, points_gagnes, bonne_reponse: q.reponse_correcte });
}));

// ── Classement ──────────────────────────────────────────────────────
// GET /api/classement?limit=10
app.get('/api/classement', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const [rows] = await pool.query(
    `SELECT u.nom_utilisateur, s.score, s.nb_questions, s.duree_secondes, s.date_jouee
     FROM scores s
     JOIN utilisateurs u ON u.id = s.utilisateur_id
     ORDER BY s.score DESC, s.duree_secondes ASC
     LIMIT ?`,
    [limit]
  );
  res.json({ success: true, data: rows });
}));

// ── Administration (questions) ─────────────────────────────────────
// POST /api/admin/questions — ajouter une question
app.post('/api/admin/questions', asyncHandler(async (req, res) => {
  const { theme_id, question, options, reponse_correcte, explication, difficulte = 'moyen', points = 10 } = req.body;
  if (!theme_id || !question || !options || reponse_correcte === undefined)
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });

  const [result] = await pool.query(
    `INSERT INTO questions (theme_id, question, options, reponse_correcte, explication, difficulte, points)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [theme_id, question, JSON.stringify(options), reponse_correcte, explication, difficulte, points]
  );
  res.status(201).json({ success: true, id: result.insertId });
}));

// PUT /api/admin/questions/:id — modifier une question
app.put('/api/admin/questions/:id', asyncHandler(async (req, res) => {
  const { question, options, reponse_correcte, explication, difficulte, points, actif } = req.body;
  await pool.query(
    `UPDATE questions SET
       question = COALESCE(?, question),
       options = COALESCE(?, options),
       reponse_correcte = COALESCE(?, reponse_correcte),
       explication = COALESCE(?, explication),
       difficulte = COALESCE(?, difficulte),
       points = COALESCE(?, points),
       actif = COALESCE(?, actif)
     WHERE id = ?`,
    [question, options ? JSON.stringify(options) : null, reponse_correcte, explication, difficulte, points, actif, req.params.id]
  );
  res.json({ success: true });
}));

// DELETE /api/admin/questions/:id — soft-delete
app.delete('/api/admin/questions/:id', asyncHandler(async (req, res) => {
  await pool.query('UPDATE questions SET actif = 0 WHERE id = ?', [req.params.id]);
  res.json({ success: true });
}));

// ─── Error handler ────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Erreur interne du serveur.', details: err.message });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`✅  QuizDynamique API démarrée sur http://localhost:${PORT}`));
