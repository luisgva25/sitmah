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
    <>
      <div className="navbar-hover-area" />
      <nav className="navbar-vertical">
        <div className="navbar-vertical-content">
          <div className="navbar-vertical-top">
            <img 
              src={logoSitmah} 
              alt="Logo Sitmah" 
              className="navbar-vertical-logo"
              onClick={() => navigate('/horarios')}
            />
            <div className="navbar-vertical-links">
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
            className="logout-button-vertical"
          >
            Finalizar sesión
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar; 