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
    const [editandoProgramacion, setEditandoProgramacion] = useState(null);

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

    const iniciarEdicion = (programacion) => {
        setEditandoProgramacion(programacion);
        setFormData({
            ruta: programacion.ruta,
            horarios: programacion.horarios,
            programador: programacion.programador
        });
    };

    const cancelarEdicion = () => {
        setEditandoProgramacion(null);
        setFormData({
            ruta: '',
            horarios: [],
            programador: localStorage.getItem('userId') || ''
        });
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

        if (!formData.programador) {
            formData.programador = 'programador1';
        }

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

        try {
            if (editandoProgramacion) {
                await programacionService.update(editandoProgramacion._id, datosAEnviar);
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Programación actualizada correctamente',
                    icon: 'success'
                });
            } else {
                await programacionService.create(datosAEnviar);
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Programación guardada correctamente',
                    icon: 'success'
                });
            }
            
            setFormData({
                ruta: '',
                horarios: [],
                programador: formData.programador
            });
            setEditandoProgramacion(null);
            cargarProgramaciones();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar la programación',
                icon: 'error'
            });
        }
    };

    const eliminarProgramacion = async (id) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await programacionService.delete(id);
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La programación ha sido eliminada',
                    icon: 'success'
                });
                cargarProgramaciones();
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar la programación',
                icon: 'error'
            });
        }
    };

    return (
        <div className="apertura-page">
            <Navbar />
            <main className="apertura-content">
                <div className="apertura-header">
                    <h2>{editandoProgramacion ? 'Editar Programación' : 'Programación de Rutas'}</h2>
                </div>

                <div className="programador-container">
                    <div className="form-section">
                        <form onSubmit={handleSubmit} className="apertura-form">
                            <div className="form-group">
                                <h3>Ruta:</h3>
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
                                <div className="horario-inputs">
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
                                        <div key={index} className="horario-item">
                                            <span>{horario.hora}</span>
                                            <span>Corrida: {horario.corrida}</span>
                                            <button
                                                type="button"
                                                onClick={() => eliminarHorario(index)}
                                                className="btn-delete"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    {editandoProgramacion ? 'Actualizar Programación' : 'Guardar Programación'}
                                </button>
                                {editandoProgramacion && (
                                    <button
                                        type="button"
                                        onClick={cancelarEdicion}
                                        className="btn-cancel"
                                    >
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="programaciones-section">
                        <h3>Programaciones Guardadas</h3>
                        <div className="programaciones-list">
                            {programaciones.map(programacion => (
                                <div key={programacion._id} className="programacion-card">
                                    <div className="programacion-header">
                                        <h4>Ruta: {programacion.ruta}</h4>
                                        <div className="programacion-actions">
                                            <button
                                                onClick={() => iniciarEdicion(programacion)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarProgramacion(programacion._id)}
                                                className="btn-delete"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    <p>Fecha: {new Date(programacion.fechaCreacion).toLocaleDateString()}</p>
                                    <div className="horarios-list">
                                        {programacion.horarios.map((horario, index) => (
                                            <div key={index} className="horario-badge">
                                                {horario.hora} - Corrida {horario.corrida}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Programador;
