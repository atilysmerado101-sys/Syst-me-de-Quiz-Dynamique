import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:3001/api";

const THEMES = [
  { id: 1, name: "Capitales du monde", icon: "🌍", color: "#2563eb", bg: "#dbeafe" },
  { id: 2, name: "Histoire",           icon: "📜", color: "#7c3aed", bg: "#ede9fe" },
  { id: 3, name: "Sciences",           icon: "🔬", color: "#059669", bg: "#d1fae5" },
  { id: 4, name: "Géographie",         icon: "🗺️", color: "#0891b2", bg: "#cffafe" },
  { id: 5, name: "Deviner le film",    icon: "🎬", color: "#dc2626", bg: "#fee2e2" },
  { id: 6, name: "Acteurs célèbres",   icon: "🎭", color: "#d97706", bg: "#fef3c7" },
  { id: 7, name: "Séries populaires",  icon: "📺", color: "#9333ea", bg: "#f3e8ff" },
  { id: 8, name: "Répliques cultes",   icon: "💬", color: "#0f766e", bg: "#ccfbf1" },
];

// Timer Ring Component
function TimerRing({ seconds, max }) {
  const r = 31;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / max);
  const urgent = seconds <= 5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--surface2)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={urgent ? "var(--danger)" : "var(--accent)"}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: '800',
          color: urgent ? "var(--danger)" : "var(--text)",
          animation: urgent ? 'timerPulse 0.6s ease infinite' : 'none'
        }}>
          {seconds}
        </div>
      </div>
    </div>
  );
}

function QuizPage({ user }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("config");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("mixte");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  // This ref stores the pending auto-advance timeout so we can cancel it safely.
  const advanceTimeoutRef = useRef(null);

  const TIME_PER_Q = 30;

  // Timer
  useEffect(() => {
    if (!timerActive || chosen !== null) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, chosen]);

  useEffect(() => {
    // Clear any pending auto-navigation when the component unmounts.
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, []);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      // Start session
      const sessionRes = await fetch(`${API_BASE}/step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pseudo: user.nom_utilisateur,
          theme_ids: selectedThemes,
          nb_questions: questionCount,
          difficulte: difficulty
        })
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok || !sessionData.success) throw new Error(sessionData.error || 'Impossible de demarrer la session');

      setSessionId(sessionData.step_id);

      // Get questions
      const themesParam = selectedThemes.length ? selectedThemes.join(',') : '';
      const questionsRes = await fetch(`${API_BASE}/questions?themes=${themesParam}&limit=${questionCount}&difficulty=${difficulty}`);
      const questionsData = await questionsRes.json();
      if (!questionsRes.ok || !questionsData.success) throw new Error(questionsData.error || 'Impossible de charger les questions');
      if (!Array.isArray(questionsData.data) || questionsData.data.length === 0) throw new Error('Aucune question disponible pour ce filtre');

      setQuestions(questionsData.data);
      setScreen("quiz");
      setCurrentIdx(0);
      setAnswers([]);
      setTotalScore(0);
      setTimeLeft(TIME_PER_Q);
      setTimerActive(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Erreur lors du démarrage du quiz');
    } finally {
      setLoading(false);
    }
  }, [selectedThemes, questionCount, difficulty, user.nom_utilisateur]);

  const handleAnswer = async (answerIdx) => {
    if (chosen !== null) return;
    setChosen(answerIdx);
    setTimerActive(false);

    const currentQ = questions[currentIdx];
    // Stop here if the current question is unexpectedly missing to avoid a crash.
    if (!currentQ) return;
    const isCorrect = answerIdx === currentQ.reponse_correcte;
    const points = isCorrect ? currentQ.points : 0;
    setTotalScore(prev => prev + points);
    setAnswers(prev => [...prev, { questionId: currentQ.id, answerIdx, isCorrect, points, temps_reponse: TIME_PER_Q - timeLeft }]);

    // Submit answer
    try {
      await fetch(`${API_BASE}/resultats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          step_id: sessionId,
          question_id: currentQ.id,
          reponse_donnee: answerIdx,
          temps_reponse: TIME_PER_Q - timeLeft
        })
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }

    // Cancel the previous timeout before scheduling the next transition.
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    advanceTimeoutRef.current = setTimeout(() => {
      // Mark the timeout as consumed before changing screen/question state.
      advanceTimeoutRef.current = null;
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setChosen(null);
        setTimeLeft(TIME_PER_Q);
        setTimerActive(true);
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = async () => {
    // Prevent a delayed timeout from reopening the quiz flow after the result screen.
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    setTimerActive(false);
    try {
      await fetch(`${API_BASE}/step/${sessionId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          score: totalScore,
          nb_correctes: answers.filter(a => a.isCorrect).length + (chosen === questions[currentIdx]?.reponse_correcte ? 1 : 0),
          duree_secondes: (questions.length * TIME_PER_Q) - timeLeft,
          reponses: answers
        })
      });
    } catch (error) {
      console.error('Error finishing quiz:', error);
    }
    setScreen("results");
  };

  const resetQuiz = () => {
    setScreen("config");
    setSelectedThemes([]);
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers([]);
    setChosen(null);
    setTimeLeft(TIME_PER_Q);
    setTimerActive(false);
    setTotalScore(0);
    setSessionId(null);
  };

  if (screen === "config") {
    return (
      <main className="main">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            Configuration du Quiz
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--muted)',
            marginBottom: '48px'
          }}>
            Choisissez vos thèmes et paramètres
          </p>

          <div className="config-section">
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '24px',
              color: 'var(--text)'
            }}>
              Thèmes
            </h3>
            <div className="themes-grid">
              {THEMES.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-card ${selectedThemes.includes(theme.id) ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedThemes(prev =>
                      prev.includes(theme.id)
                        ? prev.filter(id => id !== theme.id)
                        : [...prev, theme.id]
                    );
                  }}
                >
                  <div className="theme-icon">{theme.icon}</div>
                  <div className="theme-name">{theme.name}</div>
                  <div className="theme-check">✓</div>
                </div>
              ))}
            </div>
          </div>

          <div className="config-section">
            <div className="config-grid">
              <div className="config-item">
                <label>Nombre de questions</label>
                <select
                  className="config-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>
              <div className="config-item">
                <label>Difficulté</label>
                <select
                  className="config-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="mixte">Mixte</option>
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="start-btn"
            onClick={startQuiz}
            disabled={selectedThemes.length === 0 || loading}
          >
            {loading ? 'Chargement...' : 'Démarrer le Quiz'}
          </button>
        </div>
      </main>
    );
  }

  if (screen === "quiz") {
    const currentQ = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    // Render a safe fallback instead of crashing if the index temporarily exceeds the list.
    if (!currentQ) {
      return (
        <div className="quiz-wrap">
          <div className="question-card">
            <div className="question-text">Chargement du resultat...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-wrap">
        <div className="progress-bar-wrap">
          <div className="progress-meta">
            <div className="progress-label">Question {currentIdx + 1} sur {questions.length}</div>
            <div className="progress-count">{totalScore} pts</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <TimerRing seconds={timeLeft} max={TIME_PER_Q} />

        <div className="question-card">
          <div className="question-theme-tag">
            {currentQ.theme_icone} {currentQ.theme_nom}
          </div>
          <div className="question-text">{currentQ.question}</div>
        </div>

        <div className="options-grid">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${chosen === idx ? (idx === currentQ.reponse_correcte ? 'correct' : 'wrong') : ''} ${chosen !== null && idx === currentQ.reponse_correcte ? 'reveal-correct' : ''}`}
              onClick={() => handleAnswer(idx)}
              disabled={chosen !== null}
            >
              <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {chosen !== null && (
          <div className="explanation-box">
            <strong>Réponse {chosen === currentQ.reponse_correcte ? 'correcte' : 'incorrecte'}</strong>
            <p>{currentQ.explication}</p>
          </div>
        )}

        {chosen !== null && (
          <button className="next-btn" onClick={() => {
            // Cancel auto-advance because the player explicitly chose to continue now.
            if (advanceTimeoutRef.current) {
              clearTimeout(advanceTimeoutRef.current);
              advanceTimeoutRef.current = null;
            }
            if (currentIdx < questions.length - 1) {
              setCurrentIdx(prev => prev + 1);
              setChosen(null);
              setTimeLeft(TIME_PER_Q);
              setTimerActive(true);
            } else {
              finishQuiz();
            }
          }}>
            {currentIdx < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
          </button>
        )}
      </div>
    );
  }

  if (screen === "results") {
    const correctCount = answers.filter(a => a.isCorrect).length + (chosen === questions[questions.length - 1]?.reponse_correcte ? 1 : 0);
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="results-wrap">
        <div className="results-emoji">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}</div>
        <h1 className="results-title">
          {percentage >= 80 ? 'Excellent travail !' : percentage >= 60 ? 'Bon score !' : 'Continuez à vous entraîner !'}
        </h1>
        <p className="results-sub">Vous avez obtenu {totalScore} points sur un maximum possible.</p>

        <div className="score-circle-wrap">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--surface2)" strokeWidth="10" />
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
          </svg>
          <div className="score-circle-inner">
            <div className="score-pct">{percentage}%</div>
            <div className="score-pct-label">de réussite</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num green">{correctCount}</div>
            <div className="stat-label">Correctes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num red">{questions.length - correctCount}</div>
            <div className="stat-label">Incorrectes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num blue">{totalScore}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>

        <div className="results-actions">
          <button className="btn-secondary" onClick={resetQuiz}>Rejouer</button>
          <button className="btn-primary" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return null;
}

export default QuizPage;
