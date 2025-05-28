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

    const iniciarEdicion = (programacion) => {
        setEditandoProgramacion(programacion);
        setFormData({
            ruta: programacion.ruta,
            tipoVehiculo: programacion.tipoVehiculo || '',
            cantidadUnidades: programacion.cantidadUnidades || '',
            kilometraje: programacion.kilometraje || '',
            viajes: programacion.viajes || '',
            programador: programacion.programador
        });
    };

    const cancelarEdicion = () => {
        setEditandoProgramacion(null);
        setFormData({
            ruta: '',
            tipoVehiculo: '',
            cantidadUnidades: '',
            kilometraje: '',
            viajes: '',
            programador: localStorage.getItem('userId') || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.ruta || !formData.tipoVehiculo || !formData.cantidadUnidades || !formData.kilometraje || !formData.viajes) {
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
            tipoVehiculo: formData.tipoVehiculo,
            cantidadUnidades: formData.cantidadUnidades,
            kilometraje: formData.kilometraje,
            viajes: formData.viajes,
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
                tipoVehiculo: '',
                cantidadUnidades: '',
                kilometraje: '',
                viajes: '',
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
                <div className={`apertura-header${showHeader ? '' : ' apertura-header-hidden'}`}>
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
                                    <p><strong>Fecha:</strong> {programacion.fechaCreacion ? new Date(programacion.fechaCreacion).toLocaleDateString() : ''}</p>
                                    <p><strong>Tipo de Vehículo:</strong> {programacion.tipoVehiculo}</p>
                                    <p><strong>Cantidad de Unidades:</strong> {programacion.cantidadUnidades}</p>
                                    <p><strong>Kilometraje Programado:</strong> {programacion.kilometraje}</p>
                                    <p><strong>Viajes Programados:</strong> {programacion.viajes}</p>
                                    <p><strong>Programador:</strong> {programacion.programador}</p>
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
