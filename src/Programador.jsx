import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programacionService } from './services/api';
import Swal from 'sweetalert2';
import Navbar from './components/Navbar';
import './Apertura.css';

function Programador() {
    const navigate = useNavigate();
    const [programaciones, setProgramaciones] = useState([]);
    const [formData, setFormData] = useState({
        ruta: '',
        horarios: [],
        programador: localStorage.getItem('userId') || ''
    });
    const [nuevoHorario, setNuevoHorario] = useState({
        hora: '',
        corrida: ''
    });

    useEffect(() => {
        cargarProgramaciones();
    }, []);

    const cargarProgramaciones = async () => {
        try {
            const data = await programacionService.getAll();
            setProgramaciones(data);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las programaciones',
                icon: 'error'
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHorarioChange = (e) => {
        const { name, value } = e.target;
        setNuevoHorario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const agregarHorario = () => {
        if (!nuevoHorario.hora || !nuevoHorario.corrida) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor complete todos los campos del horario',
                icon: 'error'
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            horarios: [...prev.horarios, { ...nuevoHorario, estado: 'pendiente' }]
        }));
        setNuevoHorario({ hora: '', corrida: '' });
    };

    const eliminarHorario = (index) => {
        setFormData(prev => ({
            ...prev,
            horarios: prev.horarios.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.ruta || formData.horarios.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor complete todos los campos requeridos',
                icon: 'error'
            });
            return;
        }

        // Asegurarnos que tenemos un programador
        if (!formData.programador) {
            formData.programador = 'programador1'; // Temporal, después se reemplazará con el ID real
        }

        // Preparar los datos para enviar
        const datosAEnviar = {
            ruta: formData.ruta,
            horarios: formData.horarios.map(h => ({
                hora: h.hora,
                corrida: h.corrida,
                estado: 'pendiente'
            })),
            programador: formData.programador,
            estado: 'activo'
        };

        console.log('Datos a enviar:', datosAEnviar); // Para depuración

        try {
            const respuesta = await programacionService.create(datosAEnviar);
            console.log('Respuesta del servidor:', respuesta); // Para depuración
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Programación guardada correctamente',
                icon: 'success'
            });
            
            setFormData({
                ruta: '',
                horarios: [],
                programador: formData.programador
            });
            
            cargarProgramaciones();
        } catch (error) {
            console.error('Error completo:', error); // Para depuración
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al guardar la programación',
                icon: 'error'
            });
        }
    };

    return (
        <div className="apertura-page">
            <Navbar />
            <main className="apertura-content">
                <div className="apertura-header">
                    <h2>Programación de Rutas</h2>
                </div>

                <form onSubmit={handleSubmit} className="apertura-form">
                    <div className="form-group">
                        <label>Ruta:</label>
                        <input
                            type="text"
                            name="ruta"
                            value={formData.ruta}
                            onChange={handleInputChange}
                            placeholder="Ingrese la ruta"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Horarios</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="time"
                                name="hora"
                                value={nuevoHorario.hora}
                                onChange={handleHorarioChange}
                                required
                            />
                            <input
                                type="text"
                                name="corrida"
                                value={nuevoHorario.corrida}
                                onChange={handleHorarioChange}
                                placeholder="Número de corrida"
                                required
                            />
                            <button
                                type="button"
                                onClick={agregarHorario}
                                className="btn-submit"
                            >
                                Agregar Horario
                            </button>
                        </div>

                        <div className="horarios-list">
                            {formData.horarios.map((horario, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px'
                                }}>
                                    <span>{horario.hora}</span>
                                    <span>Corrida: {horario.corrida}</span>
                                    <button
                                        type="button"
                                        onClick={() => eliminarHorario(index)}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            Guardar Programación
                        </button>
                    </div>
                </form>

                <div className="programaciones-list" style={{ marginTop: '2rem' }}>
                    <h3>Programaciones Guardadas</h3>
                    {programaciones.map(programacion => (
                        <div key={programacion._id} style={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h4>Ruta: {programacion.ruta}</h4>
                            <p>Fecha: {new Date(programacion.fechaCreacion).toLocaleDateString()}</p>
                            <div className="horarios-list">
                                {programacion.horarios.map((horario, index) => (
                                    <div key={index} style={{
                                        display: 'inline-block',
                                        margin: '0.25rem',
                                        padding: '0.5rem',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px'
                                    }}>
                                        {horario.hora} - Corrida {horario.corrida}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Programador;
