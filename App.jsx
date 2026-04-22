import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import QuizPage from './components/QuizPage';
import Navbar from './components/Navbar';

const API_BASE = "http://localhost:3001/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token
      fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    navigate('/quiz');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f0f13'
      }}>
        <div style={{ color: '#f0f0f5' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="app-wrap">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />} />
        <Route path="/quiz" element={user ? <QuizPage user={user} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-display: 'Sora', sans-serif;
    --font-body: 'Inter', sans-serif;
    --bg: #0f0f13;
    --surface: #18181f;
    --surface2: #22222d;
    --border: rgba(255,255,255,0.07);
    --text: #f0f0f5;
    --muted: #8888a0;
    --accent: #6366f1;
    --accent2: #818cf8;
    --success: #22c55e;
    --danger: #ef4444;
    --warning: #f59e0b;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  #root { min-height: 100vh; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 3px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }
  @keyframes timerPulse {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.15); }
  }
  @keyframes progressFill {
    from { width: 0%; }
  }

  .fade-up { animation: fadeUp 0.5s ease both; }

  button { cursor: pointer; font-family: var(--font-body); border: none; }

  /* ── Layout ── */
  .app-wrap {
    min-height: 100vh;
    background: radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 100%, rgba(129,140,248,0.08) 0%, transparent 60%),
                var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── Header ── */
  .header {
    width: 100%;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(15,15,19,0.85);
  }
  .logo {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 800;
    background: linear-gradient(135deg, #818cf8, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }
  .logo span { color: white; -webkit-text-fill-color: white; }

  /* ── Main content ── */
  .main { flex: 1; width: 100%; max-width: 1000px; padding: 48px 24px; }

  /* ── Hero ── */
  .hero {
    text-align: center;
    margin-bottom: 56px;
    animation: fadeUp 0.6s ease both;
  }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 50px;
    padding: 6px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent2);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }
  .hero-title .highlight {
    background: linear-gradient(135deg, #818cf8, #6366f1, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    color: var(--muted);
    font-size: 1.05rem;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.65;
  }

  /* ── Theme grid ── */
  .section-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }
  .theme-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    animation: fadeUp 0.5s ease both;
    position: relative;
    overflow: hidden;
  }
  .theme-card::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 16px;
  }
  .theme-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.15);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }
  .theme-card:hover::before { opacity: 1; }
  .theme-card.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }
  .theme-icon {
    font-size: 2rem;
    margin-bottom: 12px;
    display: block;
  }
  .theme-name {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
  }
  .theme-check {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    transform: scale(0.5);
  }
  .theme-card.selected .theme-check {
    opacity: 1;
    transform: scale(1);
  }

  /* ── Config section ── */
  .config-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s 0.1s ease both;
  }
  .config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .config-item label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .config-select, .config-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }
  .config-select:focus, .config-input:focus {
    border-color: var(--accent);
  }

  /* ── Start button ── */
  .start-btn {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    border-radius: 16px;
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    transition: all 0.25s;
    box-shadow: 0 8px 30px rgba(99,102,241,0.35);
    animation: fadeUp 0.5s 0.2s ease both;
  }
  .start-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(99,102,241,0.5);
  }
  .start-btn:active:not(:disabled) { transform: translateY(0); }
  .start-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* ── Quiz screen ── */
  .quiz-wrap { width: 100%; max-width: 720px; margin: 0 auto; padding: 40px 24px; }

  /* Progress bar */
  .progress-bar-wrap {
    margin-bottom: 32px;
    animation: fadeUp 0.4s ease both;
  }
  .progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .progress-label { font-size: 0.8rem; font-weight: 600; color: var(--muted); }
  .progress-count { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; }
  .progress-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 99px;
    transition: width 0.4s ease;
  }

  /* Question card */
  .question-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 36px;
    margin-bottom: 24px;
    animation: fadeUp 0.4s 0.15s ease both;
  }
  .question-theme-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 20px;
    background: rgba(99,102,241,0.1);
    color: var(--accent2);
    border: 1px solid rgba(99,102,241,0.2);
  }
  .question-text {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.45;
    letter-spacing: -0.01em;
  }

  /* Answer options */
  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    animation: fadeUp 0.4s 0.2s ease both;
  }
  .option-btn {
    padding: 18px 20px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    color: var(--text);
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .option-letter {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .option-btn:hover:not(:disabled) {
    border-color: var(--accent);
    background: rgba(99,102,241,0.08);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .option-btn:hover:not(:disabled) .option-letter {
    background: var(--accent);
    color: white;
  }
  .option-btn.correct {
    border-color: var(--success);
    background: rgba(34,197,94,0.08);
    animation: pop 0.3s ease;
  }
  .option-btn.correct .option-letter {
    background: var(--success);
    color: white;
  }
  .option-btn.wrong {
    border-color: var(--danger);
    background: rgba(239,68,68,0.08);
    animation: shake 0.4s ease;
  }
  .option-btn.wrong .option-letter {
    background: var(--danger);
    color: white;
  }
  .option-btn.reveal-correct {
    border-color: var(--success);
    background: rgba(34,197,94,0.06);
    opacity: 0.75;
  }
  .option-btn:disabled { cursor: default; }

  /* Explanation */
  .explanation-box {
    background: rgba(99,102,241,0.07);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 16px;
    padding: 20px 24px;
    margin-top: 16px;
    animation: fadeUp 0.3s ease both;
    font-size: 0.925rem;
    color: var(--text);
    line-height: 1.65;
  }
  .explanation-box strong {
    color: var(--accent2);
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Next button */
  .next-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    border-radius: 14px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    margin-top: 16px;
    transition: all 0.2s;
    box-shadow: 0 6px 24px rgba(99,102,241,0.35);
    animation: fadeUp 0.3s ease both;
  }
  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(99,102,241,0.5);
  }

  /* ── Results screen ── */
  .results-wrap { width: 100%; max-width: 640px; margin: 0 auto; padding: 48px 24px; text-align: center; }
  .results-emoji {
    font-size: 5rem;
    display: block;
    margin-bottom: 24px;
    animation: pop 0.5s ease both;
  }
  .results-title {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }
  .results-sub { color: var(--muted); font-size: 1rem; margin-bottom: 40px; }

  .score-circle-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 40px;
  }
  .score-circle-wrap svg { transform: rotate(-90deg); }
  .score-circle-wrap circle { fill: none; stroke-width: 10; stroke-linecap: round; }
  .score-circle-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .score-pct {
    font-family: var(--font-display);
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1;
  }
  .score-pct-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 4px;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px 16px;
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 1.7rem;
    font-weight: 800;
    display: block;
    margin-bottom: 4px;
  }
  .stat-num.green { color: var(--success); }
  .stat-num.red   { color: var(--danger); }
  .stat-num.blue  { color: var(--accent2); }
  .stat-label { font-size: 0.75rem; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

  .results-actions { display: flex; gap: 12px; }
  .btn-primary {
    flex: 1;
    padding: 16px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    border-radius: 14px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.2s;
    box-shadow: 0 6px 24px rgba(99,102,241,0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(99,102,241,0.5); }
  .btn-secondary {
    flex: 1;
    padding: 16px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    color: var(--text);
    border-radius: 14px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.2s;
  }
  .btn-secondary:hover {
    border-color: rgba(255,255,255,0.2);
    background: var(--surface2);
    transform: translateY(-2px);
  }

  /* ── Loader ── */
  .loader-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 16px; }
  .spinner { width: 40px; height: 40px; border: 3px solid var(--surface2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .loader-text { color: var(--muted); font-size: 0.9rem; animation: pulse 1.5s ease infinite; }

  /* ── Error ── */
  .error-box {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    color: var(--danger);
    margin: 24px 0;
  }
  .error-box p { margin-bottom: 16px; }

  /* Responsive */
  @media (max-width: 600px) {
    .options-grid { grid-template-columns: 1fr; }
    .config-grid  { grid-template-columns: 1fr; }
    .stats-row    { grid-template-columns: repeat(3,1fr); }
    .header { padding: 16px 20px; }
    .main, .quiz-wrap, .results-wrap { padding-left: 16px; padding-right: 16px; }
    .question-text { font-size: 1.1rem; }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;

