// Apertura2.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Apertura.css';
import logoSitmah from './assets/logo-sitmah.png';
import Swal from 'sweetalert2';
import Navbar from './components/Navbar';

export default function Apertura2() {
  const navigate = useNavigate();
  const [tipoUnidad, setTipoUnidad] = useState('');
  const [ruta, setRuta] = useState('');
  const [economico, setEconomico] = useState('');
  const [tarjeton, setTarjeton] = useState('');
  const [nombre, setNombre] = useState('');

  const handleAgregar = () => {
    if (tipoUnidad && ruta && economico && tarjeton && nombre) {
      // Leer las tablas existentes
      const tablasCombinadas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');
      if (tablasCombinadas.length === 0) {
        Swal.fire({
          title: 'Error',
          text: 'Primero debes guardar una tabla de horarios',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      // Buscar la última tabla guardada
      const ultimaTabla = tablasCombinadas[tablasCombinadas.length - 1];

      // Inicializar el array de aperturas si no existe
      if (!ultimaTabla.aperturas) ultimaTabla.aperturas = [];

      // Buscar si ya existe una apertura para esa ruta
      const idx = ultimaTabla.aperturas.findIndex(a => a.ruta === ruta);

      if (idx !== -1) {
        // Si existe, actualizar los datos de apertura
        ultimaTabla.aperturas[idx] = {
          tipoUnidad,
          ruta,
          economico,
          tarjeton,
          nombre
        };
      } else {
        // Si no existe, agregar la nueva apertura
        ultimaTabla.aperturas.push({
          tipoUnidad,
          ruta,
          economico,
          tarjeton,
          nombre
        });
      }

      // Guardar el array actualizado
      localStorage.setItem('tablasCombinadas', JSON.stringify(tablasCombinadas));

      // Guardar también en aperturasGuardadas
      const aperturasGuardadas = JSON.parse(localStorage.getItem('aperturasGuardadas') || '[]');
      const idxApertura = aperturasGuardadas.findIndex(a => a.ruta === ruta);
      if (idxApertura !== -1) {
        aperturasGuardadas[idxApertura] = {
          tipoUnidad,
          ruta,
          economico,
          tarjeton,
          nombre
        };
      } else {
        aperturasGuardadas.push({
          tipoUnidad,
          ruta,
          economico,
          tarjeton,
          nombre
        });
      }
      localStorage.setItem('aperturasGuardadas', JSON.stringify(aperturasGuardadas));

      Swal.fire({
        title: '¡Éxito!',
        text: 'Registro de apertura agregado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/apertura');
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/home');
  };

  return (
    <div className="apertura-page">
      <Navbar />
      <main className="apertura-content">
        <h2 style={{ color: '#333', fontSize: '1.8rem', margin: 0, textAlign: 'left', width: '100%', maxWidth: '1200px' }}>Agregar Servicio</h2>
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '1200px',
          margin: '2rem auto 0 auto',
          padding: '2rem 1.5rem'
        }}>
          <form onSubmit={e => { e.preventDefault(); handleAgregar(); }} style={{ width: '100%' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: 500 }}>Tipo de Unidad</label>
                <input
                  value={tipoUnidad}
                  onChange={e => setTipoUnidad(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  placeholder="Ingrese el tipo de unidad"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: 500 }}>Ruta</label>
                <input
                  value={ruta}
                  onChange={e => setRuta(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  placeholder="Ingrese la ruta"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: 500 }}>Económico</label>
                <input
                  value={economico}
                  onChange={e => setEconomico(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  placeholder="Ingrese el económico"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: 500 }}>No. de Tarjetón</label>
                <input
                  value={tarjeton}
                  onChange={e => setTarjeton(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  placeholder="Ingrese el número de tarjetón"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#444', fontWeight: 500 }}>Nombre</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/apertura')}
                style={{ padding: '0.8rem 2rem', border: '1px solid #CBB26A', borderRadius: '6px', background: 'transparent', color: '#CBB26A', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.8rem 2rem', border: 'none', borderRadius: '6px', background: '#CBB26A', color: '#fff', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(203, 178, 106, 0.2)' }}
              >
                Guardar y Volver
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}