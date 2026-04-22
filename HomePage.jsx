import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:3001/api";

function HomePage({ user }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/classement?limit=5`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeaderboard(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/quiz');
    } else {
      navigate('/auth');
    }
  };

  return (
    <main className="main">
      <section className="hero">
        <div className="hero-eyebrow">🎯 Quiz Interactif</div>
        <h1 className="hero-title">
          Testez vos <span className="highlight">connaissances</span>
        </h1>
        <p className="hero-sub">
          Défiez-vous sur des thèmes variés avec notre quiz dynamique.
          Questions à choix multiples, vrai/faux et plus encore !
        </p>
        <button className="start-btn" onClick={handleStart}>
          {user ? 'Commencer le Quiz' : 'Se Connecter pour Jouer'}
        </button>
      </section>

      <section style={{ marginTop: '48px' }}>
        <h2 className="section-title">🏆 Classement des 5 Meilleurs Scores</h2>
        <div style={{ display: 'grid', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {leaderboard.map((entry, index) => (
            <div 
              key={index} 
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: index < 3 ? 'black' : 'var(--text)'
                }}>
                  {index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text)' }}>{entry.nom_utilisateur}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                    {entry.nb_questions} questions • {entry.duree_secondes}s
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent2)' }}>
                {entry.score} pts
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>
              Aucun score enregistré pour le moment.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;