import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Apertura.css';
import logoSitmah from '../assets/logo-sitmah.png';
import Swal from 'sweetalert2';

function TablasGuardadas() {
    const navigate = useNavigate();
    const [tablasCombinadas, setTablasCombinadas] = useState([]);

    useEffect(() => {
        const tablas = JSON.parse(localStorage.getItem('tablasCombinadas') || '[]');
        console.log('Tablas cargadas (estructura completa):', JSON.stringify(tablas, null, 2));
        setTablasCombinadas(tablas);
    }, []);

    console.log('Estado actual de tablasCombinadas:', tablasCombinadas);

    const handleVerTabla = (tablaId) => {
        navigate('/tabla-completa', {
            state: {
                tablaId: tablaId
            }
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

    // Función para verificar la estructura de una tabla
    const verificarEstructuraTabla = (tabla) => {
        console.log('Estructura de tabla individual:', JSON.stringify(tabla, null, 2));
        return tabla && (
            (Array.isArray(tabla.rutas) && tabla.rutas.length > 0) ||
            (Array.isArray(tabla.horario) && tabla.horario.length > 0)
        );
    };

    return (
        <div className="apertura-page" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#fff' }}>
                <div className="navbar-left">
                    <img src={logoSitmah} alt="Logo Sitmah" style={{ height: '40px' }} />
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/" className="navbar-link">Horarios</Link>
                        <Link to="/apertura" className="navbar-link">Apertura</Link>
                        <Link to="/tablas-guardadas" className="navbar-link active">Tablas Guardadas</Link>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="logout-button"
                >
                    Finalizar sesión
                </button>
            </nav>

            <main className="apertura-content" style={{ padding: '1rem' }}>
                <h2 style={{ 
                    color: '#6F2234', 
                    fontSize: '1.8rem', 
                    margin: '0 0 1rem 0', 
                    width: '100%', 
                    maxWidth: '1200px',
                    textAlign: 'center'
                }}>
                    Tablas Guardadas
                </h2>

                <div className="table-container" style={{ 
                    width: '100%', 
                    maxWidth: '1200px', 
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {tablasCombinadas.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {tablasCombinadas.map((tabla) => (
                                <div key={tabla.id} className="tabla-card" style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '0.75rem',
                                    backgroundColor: 'white',
                                    margin: '0.5rem'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '0.5rem',
                                        borderBottom: '1px solid #eee',
                                        paddingBottom: '0.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ 
                                                color: '#6F2234', 
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}>
                                                {tabla.nombre || `Tabla del ${new Date(tabla.fechaCreacion).toLocaleDateString()}`}
                                            </span>
                                            <span style={{ 
                                                color: '#666',
                                                fontSize: '0.9rem'
                                            }}>
                                                ({tabla.horarios?.length || 0} horarios)
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-submit"
                                                onClick={() => handleVerTabla(tabla.id)}
                                                style={{ padding: '0.5rem 1rem' }}
                                            >
                                                Ver Tabla
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleBorrarTabla(tabla.id)}
                                                style={{ padding: '0.5rem 1rem' }}
                                            >
                                                Eliminar Tabla
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ 
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                        gap: '0.5rem',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        padding: '0.5rem',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '4px'
                                    }}>
                                        {tabla.horarios?.map((horario, index) => (
                                            <div key={index} style={{
                                                padding: '0.5rem',
                                                backgroundColor: 'white',
                                                borderRadius: '4px',
                                                border: '1px solid #eee',
                                                fontSize: '0.9rem'
                                            }}>
                                                <div style={{ fontWeight: 'bold' }}>{horario.ruta}</div>
                                                <div>{horario.fecha} - {horario.horaSalida}</div>
                                                {horario.intervalo && <div>Intervalo: {horario.intervalo}</div>}
                                                {horario.corridaIni && horario.corridaFin && 
                                                    <div>Corridas: {horario.corridaIni}-{horario.corridaFin}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="archivo-uploader" style={{ 
                            padding: '2rem',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            margin: '1rem'
                        }}>
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