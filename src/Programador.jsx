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
<<<<<<< HEAD
        tipoVehiculo: '',
        cantidadUnidades: '',
        kilometraje: '',
        viajes: '',
        programador: localStorage.getItem('userId') || ''
    });
    const [editandoProgramacion, setEditandoProgramacion] = useState(null);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = React.useRef(window.scrollY);

    useEffect(() => {
        cargarProgramaciones();
        const handleScroll = () => {
            if (window.scrollY < 10) {
                setShowHeader(true);
                lastScrollY.current = window.scrollY;
                return;
            }
            if (window.scrollY > lastScrollY.current) {
                setShowHeader(false); // Scroll hacia abajo
            } else {
                setShowHeader(true); // Scroll hacia arriba
            }
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
=======
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
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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

<<<<<<< HEAD
=======
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

>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
    const iniciarEdicion = (programacion) => {
        setEditandoProgramacion(programacion);
        setFormData({
            ruta: programacion.ruta,
<<<<<<< HEAD
            tipoVehiculo: programacion.tipoVehiculo || '',
            cantidadUnidades: programacion.cantidadUnidades || '',
            kilometraje: programacion.kilometraje || '',
            viajes: programacion.viajes || '',
=======
            horarios: programacion.horarios,
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
            programador: programacion.programador
        });
    };

    const cancelarEdicion = () => {
        setEditandoProgramacion(null);
        setFormData({
            ruta: '',
<<<<<<< HEAD
            tipoVehiculo: '',
            cantidadUnidades: '',
            kilometraje: '',
            viajes: '',
=======
            horarios: [],
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
            programador: localStorage.getItem('userId') || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        if (!formData.ruta || !formData.tipoVehiculo || !formData.cantidadUnidades || !formData.kilometraje || !formData.viajes) {
=======
        
        if (!formData.ruta || formData.horarios.length === 0) {
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
            Swal.fire({
                title: 'Error',
                text: 'Por favor complete todos los campos requeridos',
                icon: 'error'
            });
            return;
        }
<<<<<<< HEAD
        if (!formData.programador) {
            formData.programador = 'programador1';
        }
        const datosAEnviar = {
            ruta: formData.ruta,
            tipoVehiculo: formData.tipoVehiculo,
            cantidadUnidades: formData.cantidadUnidades,
            kilometraje: formData.kilometraje,
            viajes: formData.viajes,
            programador: formData.programador,
            estado: 'activo'
        };
=======

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

>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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
<<<<<<< HEAD
            setFormData({
                ruta: '',
                tipoVehiculo: '',
                cantidadUnidades: '',
                kilometraje: '',
                viajes: '',
=======
            
            setFormData({
                ruta: '',
                horarios: [],
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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
<<<<<<< HEAD
                <div className={`apertura-header${showHeader ? '' : ' apertura-header-hidden'}`}>
=======
                <div className="apertura-header">
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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
<<<<<<< HEAD
                            <div className="form-group">
                                <h3>Tipo de Vehículo:</h3>
                                <select
                                    name="tipoVehiculo"
                                    value={formData.tipoVehiculo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Urbano">Urbano</option>
                                    <option value="Suburbano">Suburbano</option>
                                    <option value="Intermunicipal">Intermunicipal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <h3>Cantidad de Unidades:</h3>
                                <input
                                    type="number"
                                    name="cantidadUnidades"
                                    value={formData.cantidadUnidades}
                                    onChange={handleInputChange}
                                    placeholder="Cantidad de unidades"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <h3>Kilometraje Programado:</h3>
                                <input
                                    type="number"
                                    name="kilometraje"
                                    value={formData.kilometraje}
                                    onChange={handleInputChange}
                                    placeholder="Kilometraje programado"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <h3>Viajes Programados:</h3>
                                <input
                                    type="number"
                                    name="viajes"
                                    value={formData.viajes}
                                    onChange={handleInputChange}
                                    placeholder="Viajes programados"
                                    required
                                />
                            </div>
=======

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

>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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
<<<<<<< HEAD
                                    <p><strong>Fecha:</strong> {programacion.fechaCreacion ? new Date(programacion.fechaCreacion).toLocaleDateString() : ''}</p>
                                    <p><strong>Tipo de Vehículo:</strong> {programacion.tipoVehiculo}</p>
                                    <p><strong>Cantidad de Unidades:</strong> {programacion.cantidadUnidades}</p>
                                    <p><strong>Kilometraje Programado:</strong> {programacion.kilometraje}</p>
                                    <p><strong>Viajes Programados:</strong> {programacion.viajes}</p>
                                    <p><strong>Programador:</strong> {programacion.programador}</p>
=======
                                    <p>Fecha: {new Date(programacion.fechaCreacion).toLocaleDateString()}</p>
                                    <div className="horarios-list">
                                        {programacion.horarios.map((horario, index) => (
                                            <div key={index} className="horario-badge">
                                                {horario.hora} - Corrida {horario.corrida}
                                            </div>
                                        ))}
                                    </div>
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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
