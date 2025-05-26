import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Apertura.css';
import logoSitmah from './assets/logo-sitmah.png';
import Swal from 'sweetalert2';

export default function Apertura() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    // Cargar datos desde localStorage
    const aperturasGuardadas = JSON.parse(localStorage.getItem('aperturasGuardadas') || '[]');
    setDatos(aperturasGuardadas);
  }, []);

  const handleNavigate = () => {
    navigate('/apertura2');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleEliminar = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6F2234",
      cancelButtonColor: "#CBB26A",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevasAperturas = datos.filter((_, i) => i !== index);
        setDatos(nuevasAperturas);
        localStorage.setItem('aperturasGuardadas', JSON.stringify(nuevasAperturas));

        Swal.fire({
          title: "¡Eliminado!",
          text: "El registro ha sido eliminado",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="apertura-page">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoSitmah} alt="Logo Sitmah" style={{ height: '40px' }} />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/apertura" className="navbar-link active">Apertura</Link>
            <Link to="/" className="navbar-link">Horarios</Link>
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

      <main className="apertura-content">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: '#333',
            fontSize: '1.8rem',
            margin: 0
          }}>Servicios Iniciados</h2>
          <button onClick={handleNavigate} className="archivo-label">
            <span className="archivo-text">Ingreso de datos</span>
            <span className="archivo-icon">📝</span>
          </button>
          </div>

        {datos.length === 0 ? (
          <div className="archivo-uploader">
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No hay servicios registrados aún.</p>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <table className="table" style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: '#4B0C25',
                  borderBottom: '2px solid #CBB26A'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Tipo de Unidad</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Ruta</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Económico</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>No. Tarjetón</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Nombre</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#fff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((dato, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #CBB26A',
                    transition: 'all 0.3s ease',
                    background: '#4B0C25',
                    color: '#fff'
                  }}>
                    <td style={{ padding: '1rem' }}>{dato.tipoUnidad}</td>
                    <td style={{ padding: '1rem' }}>{dato.ruta}</td>
                    <td style={{ padding: '1rem' }}>{dato.economico}</td>
                    <td style={{ padding: '1rem' }}>{dato.tarjeton}</td>
                    <td style={{ padding: '1rem' }}>{dato.nombre}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleEliminar(index)}
                        className="btn-delete"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}