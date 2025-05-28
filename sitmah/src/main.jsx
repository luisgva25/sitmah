import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Apertura from './Apertura.jsx'
import Apertura2 from './Apertura2.jsx'
import TablaCompleta from './components/TablaCompleta'
import TablasGuardadas from './components/TablasGuardadas'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/apertura" element={<Apertura />} />
        <Route path="/apertura2" element={<Apertura2 />} />
        <Route path="/tabla-completa" element={<TablaCompleta />} />
        <Route path="/tablas-guardadas" element={<TablasGuardadas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
