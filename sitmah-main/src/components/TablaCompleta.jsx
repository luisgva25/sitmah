import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../Apertura.css';
import logoSitmah from '../assets/logo-sitmah.png';
import Swal from 'sweetalert2';

function TablaCompleta() {
  const navigate = useNavigate();
  const location = useLocation();
  const tablasCombinadas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/home');
  };

  // Obtener la tabla específica basada en el ID
  const tablaId = location.state?.tablaId;
  const tablaActual = tablasCombinadas.find(t => t.id === tablaId);

  if (!tablaActual) {
    return (
      <div className="apertura-page">
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#fff' }}>
          <div className="navbar-left">
            <img src={logoSitmah} alt="Logo Sitmah" style={{ height: '40px' }} />
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/tablas-guardadas" className="navbar-link">Tablas Guardadas</Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Finalizar sesión
          </button>
        </nav>

        <main className="apertura-content" style={{ padding: '1rem' }}>
          <div className="archivo-uploader" style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            margin: '1rem'
          }}>
            <p style={{ color: '#6F2234', fontSize: '1.1rem' }}>Tabla no encontrada</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="apertura-page">

      <main className="apertura-content" style={{ padding: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          marginBottom: '1rem'
        }}>
          <div>
            <h2 style={{
              color: '#6F2234',
              fontSize: '1.8rem',
              margin: '0 0 0.5rem 0'
            }}>
              {tablaActual.nombre || `Tabla del ${new Date(tablaActual.fechaCreacion).toLocaleDateString()}`}
            </h2>
            <p style={{
              color: '#666',
              margin: 0,
              fontSize: '0.9rem'
            }}>
              {tablaActual.horarios.length} horarios registrados
            </p>
          </div>

        </div>

        <div className="table-container" style={{
          width: '70%',
          maxWidth: '1700px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'auto'
        }}>
          <table className="table" style={{ margin: 0 }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
              <tr>
                <th>Ruta</th>
                <th>Fecha</th>
                <th>Hora de Salida</th>
                <th>Intervalo</th>
                <th>Corrida Inicial</th>
                <th>Corrida Final</th>
                <th>Tipo de Unidad</th>
                <th>Economico</th>
                <th>Tarjeton</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {tablaActual.horarios.map((horario, idx) => (
                <tr key={idx}>
                  <td>{horario.ruta}</td>
                  <td>{horario.fecha}</td>
                  <td>{horario.horaSalida}</td>
                  <td>{horario.intervalo || '-'}</td>
                  <td>{horario.corridaIni || '-'}</td>
                  <td>{horario.corridaFin || '-'}</td>
                  <td>{horario.apertura?.tipoUnidad || '-'}</td>
                  <td>{horario.apertura?.economico || '-'}</td>
                  <td>{horario.apertura?.tarjeton || '-'}</td>
                  <td>{horario.apertura?.nombre || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="btn-submit"
          onClick={() => navigate('/tablas-guardadas')}
        >
          Volver a Tablas Guardadas
        </button>
      </main>
    </div>
  );
}

export default TablaCompleta; 