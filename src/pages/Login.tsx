import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    // Limpiar el localStorage al montar el componente
    useEffect(() => {
        localStorage.removeItem('userRole');
        document.body.classList.add('login-body');
        const root = document.getElementById('root');
        if (root) root.classList.add('login-root');
        return () => {
            document.body.classList.remove('login-body');
            if (root) root.classList.remove('login-root');
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !role) {
            Swal.fire({
                title: "Error",
                text: "Por favor, complete todos los campos",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return;
        }

        const { value: password } = await Swal.fire({
            title: 'Ingrese su contraseña',
            input: 'password',
            inputLabel: 'Contraseña',
            inputPlaceholder: 'Escriba su contraseña',
            showCancelButton: true,
            confirmButtonText: 'Ingresar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe ingresar una contraseña';
                }
            }
        });

        if (password) {
            // Guardar el rol en localStorage para mantener la sesión
            localStorage.setItem('userRole', role);
            
            // Redirigir según el rol
            switch (role) {
                case 'apertura':
                    navigate('/horarios');
                    break;
                case 'programador':
                    navigate('/programador');
                    break;
                case 'dashboard':
                    navigate('/horarios');
                    break;
                case 'verificador':
                    navigate('/tablas-guardadas');
                    break;
                case 'administrador':
                    navigate('/horarios');
                    break;
                default:
                    navigate('/');
            }
        }
    };

    return (
        <div className="login-body">
            <header className="login-header">
                <h1>Sistema de Despacho de Tuzobuses</h1>
                <p>Iniciar sesión – Acceso restringido</p>
            </header>

            <main className="login-main">
                <div className="login-card">
                    <div className="login-logo-wrapper">
                        <img src="/src/assets/logobola.png" alt="Logo TUZ" className="login-logo-img" />
                        <div className="login-logo-border"></div>
                    </div>

                    <h2>Ingreso al sistema</h2>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="userId">ID de usuario:</label>
                        <input className='login-idusuario'
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Ej. TUZO001"
                        />

                        <label htmlFor="role">Rol:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="apertura">Apertura</option>
                            <option value="verificador">Verificador</option>
                            <option value="dashboard">Dashboard</option>
                            <option value="administrador">Administrador</option>
                            <option value="programador">Programador</option>
                        </select>

                        <button type="submit">Ingresar</button>
                    </form>
                </div>
            </main>

            <footer className="login-footer">
                &copy; {new Date().getFullYear()} SITMAH Hidalgo – Sistema interno de control
            </footer>
        </div>
    );
}
