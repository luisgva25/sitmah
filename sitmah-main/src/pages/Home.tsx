import React, { useEffect } from 'react';
import './style.css';
import { Link } from 'react-router-dom';

export default function Home() {
    // Limpiar el userRole cuando se monta el componente
    useEffect(() => {
        localStorage.removeItem('userRole');
    }, []);

    return (
        <>
            <header className="sitmah-header">
                <h1>Sistema de Despacho de Tuzobuses</h1>
                <p>Plataforma oficial de monitoreo y registro – SITMAH Hidalgo</p>
            </header>

            <main className="main-content">
                <h2>Bienvenido al sistema</h2>
                <p>
                    Este sistema permite registrar, verificar y enviar información de despacho en tiempo real,
                    digitalizando procesos y manteniendo la comunicación con el centro de control SITMAH.
                </p>
                <br />
                <div className="button-container">
                    <Link to="/login" className="button">
                        Ingresar al sistema
                    </Link>
                </div>
            </main>

            <footer className="sitmah-footer">
                &copy; {new Date().getFullYear()} SITMAH Hidalgo – Sistema de uso interno
            </footer>
        </>
    );
}