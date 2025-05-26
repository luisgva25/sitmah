import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import App from './App.jsx'
import Apertura from './Apertura.jsx'
import Apertura2 from './Apertura2.jsx'
import TablaCompleta from './components/TablaCompleta'
import TablasGuardadas from './components/TablasGuardadas'
import Programador from './Programador'
import { ProtectedRoute } from './components/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/horarios" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } />
        <Route path="/apertura" element={
          <ProtectedRoute>
            <Apertura />
          </ProtectedRoute>
        } />
        <Route path="/apertura2" element={
          <ProtectedRoute>
            <Apertura2 />
          </ProtectedRoute>
        } />
        <Route path="/tabla-completa" element={
          <ProtectedRoute>
            <TablaCompleta />
          </ProtectedRoute>
        } />
        <Route path="/tablas-guardadas" element={
          <ProtectedRoute>
            <TablasGuardadas />
          </ProtectedRoute>
        } />
        <Route path="/programador" element={
          <ProtectedRoute>
            <Programador />
          </ProtectedRoute>
        } />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
