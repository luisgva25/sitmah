import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Apertura.css';
import logoSitmah from './assets/logo-sitmah.png';
import Swal from 'sweetalert2';
import Navbar from './components/Navbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Apertura() {
  const location = useLocation();
  const navigate = useNavigate();
  const { horarioId, horarioData } = location.state || {};

  const [formData, setFormData] = useState({
    tipoUnidad: '',
    ruta: '',
    economico: '',
    tarjeton: '',
    nombre: ''
  });

  const [horario, setHorario] = useState(null);

  useEffect(() => {
    if (!horarioId) {
      navigate('/horarios');
      return;
    }
    // Cargar horarios desde localStorage
    const horariosGuardados = JSON.parse(localStorage.getItem('horariosActuales') || '[]');
    const horarioEncontrado = horariosGuardados.find(h => h.id === horarioId);
    if (horarioEncontrado) {
      setHorario(horarioEncontrado);
      // Pre-llenar la ruta del horario
      setFormData(prev => ({
        ...prev,
        ruta: horarioEncontrado.ruta
      }));
      // Si ya existe apertura, cargar los datos
      if (horarioEncontrado.apertura) {
        setFormData(horarioEncontrado.apertura);
      }
    } else {
      navigate('/horarios');
    }
  }, [horarioId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cargar horarios actuales
    const horariosGuardados = JSON.parse(localStorage.getItem('horariosActuales') || '[]');
    // Actualizar el horario específico
    const horariosActualizados = horariosGuardados.map(h => {
      if (h.id === horarioId) {
        return {
          ...h,
          apertura: formData
        };
      }
      return h;
    });
    // Guardar en localStorage
    localStorage.setItem('horariosActuales', JSON.stringify(horariosActualizados));
    alert('Datos de apertura guardados correctamente');
    navigate('/horarios');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!horario) {
    return (
      <div className="container">
        <Navbar />
        <main className="main-content">
          <div className="loading">Cargando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <main className="main-content">
        <div className="apertura-header">
          <h2>Asignación de Unidad</h2>
          <div className="horario-info">
            <p><strong>Ruta:</strong> {horario.ruta}</p>
            <p><strong>Fecha:</strong> {horario.fecha}</p>
            <p><strong>Hora de salida:</strong> {horario.horaSalida}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="apertura-form">
          <div className="form-group">
            <label htmlFor="tipoUnidad">Tipo de Unidad:</label>
            <input
              type="text"
              id="tipoUnidad"
              name="tipoUnidad"
              value={formData.tipoUnidad}
              onChange={handleChange}
              required
              placeholder="Ej: Urbano, Suburbano, etc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="ruta">Ruta:</label>
            <input
              type="text"
              id="ruta"
              name="ruta"
              value={formData.ruta}
              onChange={handleChange}
              required
              disabled
              className="input-disabled"
            />
          </div>
          <div className="form-group">
            <label htmlFor="economico">Económico:</label>
            <input
              type="text"
              id="economico"
              name="economico"
              value={formData.economico}
              onChange={handleChange}
              required
              placeholder="Número económico de la unidad"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tarjeton">No. de Tarjetón:</label>
            <input
              type="text"
              id="tarjeton"
              name="tarjeton"
              value={formData.tarjeton}
              onChange={handleChange}
              required
              placeholder="Número de tarjetón"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre del operador"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Guardar Asignación</button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/horarios')}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Apertura;