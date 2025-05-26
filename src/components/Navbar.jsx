import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoSitmah from '../assets/logo-sitmah.png';
import '../Apertura.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/home');
  };

  const isActive = (path) => {
    return `navbar-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <nav className="navbar" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      backgroundColor: '#fff',
      padding: '0.5rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="navbar-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div className="navbar-left" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <img 
            src={logoSitmah} 
            alt="Logo Sitmah" 
            style={{ 
              height: '40px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/horarios')}
          />
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <Link to="/horarios" className={isActive('/horarios')}>
              Horarios
            </Link>
            <Link to="/tablas-guardadas" className={isActive('/tablas-guardadas')}>
              Tablas Guardadas
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="logout-button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6F2234',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Finalizar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 