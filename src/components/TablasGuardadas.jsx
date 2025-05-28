import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Apertura.css';
import Swal from 'sweetalert2';
import Navbar from './Navbar';

function TablasGuardadas() {
    const navigate = useNavigate();
    const [tablasCombinadas, setTablasCombinadas] = useState([]);

    useEffect(() => {
        const tablas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');
        setTablasCombinadas(tablas);
    }, []);

    const handleVerTabla = (tablaId) => {
        navigate('/tabla-completa', {
            state: { tablaId }
        });
    };

    const handleBorrarTabla = (tablaId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará toda la tabla y no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6F2234",
            cancelButtonColor: "#CBB26A",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevasTablas = tablasCombinadas.filter((t) => t.id !== tablaId);
                setTablasCombinadas(nuevasTablas);
                localStorage.setItem('tablasCombinadas', JSON.stringify(nuevasTablas));
                Swal.fire({
                    title: "¡Borrado!",
                    text: "La tabla ha sido eliminada",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <div className="apertura-page">
            <Navbar />
            <main className="apertura-content">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        color: '#6F2234',
                        fontSize: '1.8rem',
                        margin: 0
                    }}>
                        Tablas Guardadas
                    </h2>
                </div>

                <div className="table-container">
                    {tablasCombinadas.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            padding: '1rem'
                        }}>
                            {tablasCombinadas.map((tabla) => (
                                <div key={tabla.id} style={{
                                    background: '#fff',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #eee'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid #eee'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: '#6F2234',
                                                fontSize: '1.2rem',
                                                margin: '0 0 0.5rem 0'
                                            }}>
                                                {tabla.nombre || `Tabla del ${new Date(tabla.fechaCreacion).toLocaleDateString()}`}
                                            </h3>
                                            <p style={{
                                                color: '#666',
                                                margin: 0,
                                                fontSize: '0.9rem'
                                            }}>
                                                {tabla.horarios?.length || 0} horarios registrados
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                className="btn-submit"
                                                onClick={() => handleVerTabla(tabla.id)}
                                            >
                                                Ver Tabla
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleBorrarTabla(tabla.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                        gap: '1rem',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        padding: '0.5rem',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '4px'
                                    }}>
                                        {tabla.horarios?.map((horario, index) => (
                                            <div key={index} style={{
                                                padding: '0.75rem',
                                                backgroundColor: '#fff',
                                                borderRadius: '4px',
                                                border: '1px solid #eee',
                                                fontSize: '0.9rem'
                                            }}>
                                                <div style={{ fontWeight: '500', color: '#6F2234' }}>
                                                    {horario.ruta}
                                                </div>
                                                <div style={{ color: '#666' }}>
                                                    {horario.fecha} - {horario.horaSalida}
                                                </div>
                                                {horario.intervalo && (
                                                    <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                        Intervalo: {horario.intervalo}
                                                    </div>
                                                )}
                                                {horario.corridaIni && horario.corridaFin && (
                                                    <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                        Corridas: {horario.corridaIni}-{horario.corridaFin}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="archivo-uploader">
                            <p style={{
                                color: '#6F2234',
                                fontSize: '1.1rem',
                                margin: 0
                            }}>
                                No hay tablas guardadas
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TablasGuardadas; 