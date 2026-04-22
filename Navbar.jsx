import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Quiz<span>Dynamique</span>
      </Link>
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#f0f0f5', textDecoration: 'none' }}>Accueil</Link>
        {user ? (
          <>
            <span style={{ color: '#f0f0f5' }}>Bienvenue, {user.nom_utilisateur}</span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #f0f0f5',
                color: '#f0f0f5',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <Link 
            to="/auth" 
            style={{ 
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;