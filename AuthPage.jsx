import React from 'react';
import { useState } from 'react';

const API_BASE = "http://localhost:3001/api";

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    // nom_utilisateur: '',
    email: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const url = `${API_BASE}${endpoint}`;
      
      console.log('📤 Envoi requête vers:', url);
      console.log('📦 Données envoyées:', formData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📥 Status HTTP:', response.status);

      const data = await response.json();
      console.log('📝 Réponse serveur:', data);

      // Vérifier le status HTTP ET la réponse
      if (!response.ok) {
        setError(data.error || `Erreur serveur (${response.status}): ${response.statusText}`);
        return;
      }

      if (data.success) {
        if (isLogin) {
          console.log('✅ Connexion réussie!');
          onLogin(data.user, data.token);
        } else {
          setIsLogin(true);
          setError('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
        }
      } else {
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error('❌ Erreur de requête:', err.message);
      setError(`Erreur de connexion au serveur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '8px',
            color: 'var(--text)'
          }}>
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            {isLogin ? 'Connectez-vous pour accéder au quiz' : 'Créez votre compte pour commencer'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: 'var(--danger)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--muted)',
                  marginBottom: '8px'
                }}>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="nom_utilisateur"
                  value={formData.nom_utilisateur}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--muted)',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--muted)',
                marginBottom: '8px'
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </button>
          </form>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ nom_utilisateur: '', email: '', mot_de_passe: '' });
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent2)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;