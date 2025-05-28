import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Swal from 'sweetalert2';
import logoSitmah from './assets/logo-sitmah.png';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const [ruta, setRuta] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [corridaIni, setCorridaIni] = useState('');
  const [corridaFin, setCorridaFin] = useState('');
  const [salidaIni, setSalidaIni] = useState(new Date(new Date().setHours(5, 50, 0, 0)));
  const [fechaDel, setFechaDel] = useState(new Date());
  const [fechaAl, setFechaAl] = useState(new Date());
  const [filtro, setFiltro] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar datos de edición si existen
  useEffect(() => {
    if (location.state?.editandoTabla) {
      const { datos, index } = location.state.editandoTabla;
      setSchedules(datos);
      
      // Limpiar el estado de navegación
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!ruta.trim()) {
      nuevosErrores.ruta = 'La ruta es obligatoria';
    }

    if (intervalo && (isNaN(intervalo) || Number(intervalo) <= 0)) {
      nuevosErrores.intervalo = 'El intervalo debe ser un número positivo';
    }

    if (corridaIni && (isNaN(corridaIni) || Number(corridaIni) <= 0)) {
      nuevosErrores.corridaIni = 'La corrida inicial debe ser un número positivo';
    }

    if (corridaFin) {
      if (isNaN(corridaFin) || Number(corridaFin) <= 0) {
        nuevosErrores.corridaFin = 'La corrida final debe ser un número positivo';
      } else if (corridaIni && Number(corridaFin) <= Number(corridaIni)) {
        nuevosErrores.corridaFin = 'La corrida final debe ser mayor que la corrida inicial';
      }
    }

    if (fechaDel > fechaAl) {
      nuevosErrores.fechas = 'La fecha inicial no puede ser posterior a la fecha final';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const getHoraString = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      Swal.fire({
        title: 'Error de validación',
        text: 'Por favor, corrige los errores en el formulario',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (editandoId !== null) {
      setSchedules(schedules.map(s =>
        s.id === editandoId
          ? {
            ...s,
            ruta,
            fecha: fechaDel.toISOString().slice(0, 10),
            horaSalida: getHoraString(salidaIni)
          }
          : s
      ));
      setEditandoId(null);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Registro actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      setSchedules([
        ...schedules,
        {
          id: Date.now(),
          ruta,
          fecha: fechaDel.toISOString().slice(0, 10),
          horaSalida: getHoraString(salidaIni)
        }
      ]);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Registro agregado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
    setRuta('');
    setIntervalo('');
    setCorridaIni('');
    setCorridaFin('');
    setSalidaIni(new Date(new Date().setHours(5, 50, 0, 0)));
    setFechaDel(new Date());
    setFechaAl(new Date());
    setErrores({});
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleEdit = (item) => {
    setRuta(item.ruta);
    setIntervalo(item.intervalo || '');
    setCorridaIni(item.corridaIni || '');
    setCorridaFin(item.corridaFin || '');
    setFechaDel(new Date(item.fecha));
    const [hours, minutes] = item.horaSalida.split(':');
    const nuevaFecha = new Date();
    nuevaFecha.setHours(Number(hours), Number(minutes), 0, 0);
    setSalidaIni(nuevaFecha);
    setEditandoId(item.id);
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setRuta('');
    setIntervalo('');
    setCorridaIni('');
    setCorridaFin('');
    setSalidaIni(new Date(new Date().setHours(5, 50, 0, 0)));
    setFechaDel(new Date());
    setFechaAl(new Date());
  };

  const handleSaveToDatabase = () => {
    if (schedules.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No hay horarios para guardar",
        icon: "error",
        confirmButtonText: "Entendido"
      });
      return;
    }

    Swal.fire({
      title: "¿Quieres guardar esta tabla de horarios?",
      text: "Se guardará como una única tabla con todos los horarios actuales",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Leer las tablas existentes
        const tablasCombinadas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');
        // Crear una nueva tabla con todos los horarios actuales
        const nuevaTabla = {
          id: Date.now(),
          fechaCreacion: new Date().toISOString(),
          nombre: `Tabla de Horarios - ${new Date().toLocaleDateString()}`,
          horarios: schedules.map(schedule => ({
            ruta: schedule.ruta,
            fecha: schedule.fecha,
            horaSalida: schedule.horaSalida,
            intervalo: intervalo || null,
            corridaIni: corridaIni || null,
            corridaFin: corridaFin || null
          }))
        };
        // Agregar la nueva tabla al array
        tablasCombinadas.push(nuevaTabla);
        // Guardar en localStorage
        localStorage.setItem('tablasCombinadas', JSON.stringify(tablasCombinadas));
        // Limpiar el formulario
        setRuta('');
        setIntervalo('');
        setCorridaIni('');
        setCorridaFin('');
        setSalidaIni(new Date(new Date().setHours(5, 50, 0, 0)));
        setFechaDel(new Date());
        setFechaAl(new Date());
        setSchedules([]);
        setEditandoId(null);
        setErrores({});
        setFiltro('');
        Swal.fire({
          title: "¡Guardado!",
          text: "La tabla de horarios se ha guardado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const filtered = schedules.filter(item =>
    item.ruta.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <img
            src={logoSitmah}
            alt="Logo SITMAH"
            className="logo-sitmah"
          />
          <h1>HORARIOS DE SERVICIO</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <button
              className="btn-submit"
              onClick={() => navigate('/tablas-guardadas')}
            >
              Ver Tablas Guardadas
            </button>
            <button
              className="btn-submit"
              onClick={() => navigate('/apertura')}
            >
              Ir a Apertura
            </button>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <div className="grid-2">
          <div className="form-group">
            <label>Ruta</label>
            <input 
              value={ruta} 
              onChange={e => setRuta(e.target.value)} 
              placeholder="Ruta" 
              className={`input ${errores.ruta ? 'input-error' : ''}`} 
            />
            {errores.ruta && <span className="error-message">{errores.ruta}</span>}
          </div>

          <div className="form-group">
            <label>Intervalo</label>
            <input 
              type="number" 
              value={intervalo} 
              onChange={e => setIntervalo(e.target.value)} 
              placeholder="Intervalo" 
              className={`input ${errores.intervalo ? 'input-error' : ''}`} 
            />
            {errores.intervalo && <span className="error-message">{errores.intervalo}</span>}
          </div>

          <div className="form-group">
            <label>Corrida Inicial</label>
            <input 
              type="number" 
              value={corridaIni} 
              onChange={e => setCorridaIni(e.target.value)} 
              placeholder="Corrida Inicial" 
              className={`input ${errores.corridaIni ? 'input-error' : ''}`} 
            />
            {errores.corridaIni && <span className="error-message">{errores.corridaIni}</span>}
          </div>

          <div className="form-group">
            <label>Corrida Final</label>
            <input 
              type="number" 
              value={corridaFin} 
              onChange={e => setCorridaFin(e.target.value)} 
              placeholder="Corrida Final" 
              className={`input ${errores.corridaFin ? 'input-error' : ''}`} 
            />
            {errores.corridaFin && <span className="error-message">{errores.corridaFin}</span>}
          </div>

          <div className="form-group">
            <label>Hora de salida</label>
            <DatePicker
              selected={salidaIni}
              onChange={date => setSalidaIni(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Hora"
              dateFormat="HH:mm"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Del</label>
            <DatePicker
              selected={fechaDel}
              onChange={date => setFechaDel(date)}
              dateFormat="yyyy-MM-dd"
              className={`input ${errores.fechas ? 'input-error' : ''}`}
            />
          </div>

          <div className="form-group">
            <label>Al</label>
            <DatePicker
              selected={fechaAl}
              onChange={date => setFechaAl(date)}
              dateFormat="yyyy-MM-dd"
              className={`input ${errores.fechas ? 'input-error' : ''}`}
            />
            {errores.fechas && <span className="error-message">{errores.fechas}</span>}
          </div>
        </div>

        <button type="submit" className="btn-submit">{editandoId !== null ? 'GUARDAR CAMBIOS' : 'SUBIR'}</button>
        {editandoId !== null && (
          <button type="button" className="btn-delete" onClick={handleCancelEdit} style={{ marginLeft: '1rem' }}>CANCELAR</button>
        )}
      </form>

      <div className="filter">
        <input
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          placeholder="Filtrar por ruta"
          className="input-filter"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Fecha</th>
            <th>Hora de salida</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.id}>
              <td>{row.ruta}</td>
              <td>{row.fecha}</td>
              <td>{row.horaSalida}</td>
              <td>
                <button onClick={() => handleEdit(row)} className="btn-edit">✏️</button>{' '}
                <button onClick={() => handleDelete(row.id)} className="btn-delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <button className="btn-submit" onClick={handleSaveToDatabase}>GUARDAR A LA BASE DE DATOS</button>
      </div>
    </div>
  );
}

export default App;