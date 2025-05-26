import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Swal from 'sweetalert2';
import logoSitmah from './assets/logo-sitmah.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Clave constante para localStorage
const STORAGE_KEY = 'horariosActuales';

function App() {
  const [ruta, setRuta] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [corridaIni, setCorridaIni] = useState('');
  const [corridaFin, setCorridaFin] = useState('');
  const [salidaIni, setSalidaIni] = useState(new Date(new Date().setHours(5, 50, 0, 0)));
  const [fechaDel, setFechaDel] = useState(new Date());
  const [fechaAl, setFechaAl] = useState(new Date());
  const [filtro, setFiltro] = useState('');
  const [schedules, setSchedules] = useState(() => {
    // Inicializar el estado con los datos del localStorage
    const savedSchedules = localStorage.getItem(STORAGE_KEY);
    return savedSchedules ? JSON.parse(savedSchedules) : [];
  });
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Guardar en localStorage cada vez que schedules cambie
  useEffect(() => {
    if (schedules.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    }
  }, [schedules]);

  // Cargar datos de edición si existen
  useEffect(() => {
    if (location.state?.editandoTabla) {
      const { datos } = location.state.editandoTabla;
      setSchedules(datos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setRuta('');
    setIntervalo('');
    setCorridaIni('');
    setCorridaFin('');
    setSalidaIni(new Date(new Date().setHours(5, 50, 0, 0)));
    setFechaDel(new Date());
    setFechaAl(new Date());
    setErrores({});
  };

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

    const nuevoHorario = {
      id: editandoId || Date.now(),
      ruta,
      fecha: fechaDel.toISOString().slice(0, 10),
      horaSalida: getHoraString(salidaIni),
      intervalo: intervalo || null,
      corridaIni: corridaIni || null,
      corridaFin: corridaFin || null
    };

    if (editandoId !== null) {
      const nuevosHorarios = schedules.map(s =>
        s.id === editandoId ? nuevoHorario : s
      );
      setSchedules(nuevosHorarios);
      setEditandoId(null);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Registro actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      setSchedules(prev => [...prev, nuevoHorario]);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Registro agregado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }

    limpiarFormulario();
  };

  const handleDelete = (id) => {
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
        const nuevosHorarios = schedules.filter(s => s.id !== id);
        setSchedules(nuevosHorarios);
        if (nuevosHorarios.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
        }
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
    limpiarFormulario();
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
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6F2234",
      cancelButtonColor: "#CBB26A"
    }).then((result) => {
      if (result.isConfirmed) {
        const tablasCombinadas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');
        const nuevaTabla = {
          id: Date.now(),
          fechaCreacion: new Date().toISOString(),
          nombre: `Tabla de Horarios - ${new Date().toLocaleDateString()}`,
          horarios: schedules
        };
        
        tablasCombinadas.push(nuevaTabla);
        localStorage.setItem('tablasCombinadas', JSON.stringify(tablasCombinadas));
        
        // Limpiar todo
        setSchedules([]);
        localStorage.removeItem(STORAGE_KEY);
        limpiarFormulario();
        setEditandoId(null);
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

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/home');
  };

  const handleApertura = (horario) => {
    navigate('/apertura', {
      state: {
        horarioId: horario.id,
        horarioData: horario
      }
    });
  };

  const filtered = schedules.filter(item =>
    item.ruta.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar />
      <main className="main-content">
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
              <th>Unidad</th>
              <th>Tarjetón</th>
              <th>Operador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td>{row.ruta}</td>
                <td>{row.fecha}</td>
                <td>{row.horaSalida}</td>
                <td>{row.apertura?.tipoUnidad || '-'}</td>
                <td>{row.apertura?.tarjeton || '-'}</td>
                <td>{row.apertura?.nombre || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(row)} className="btn-edit" title="Editar horario">✏️</button>{' '}
                  <button onClick={() => handleApertura(row)} className="btn-submit" style={{ padding: '0.3rem 0.5rem' }} title="Asignar unidad">🚌</button>{' '}
                  <button onClick={() => handleDelete(row.id)} className="btn-delete" title="Eliminar horario">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button className="btn-submit" onClick={handleSaveToDatabase}>GUARDAR A LA BASE DE DATOS</button>
        </div>
      </main>
    </div>
  );
}

export default App;