const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../src/database/config');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
    res.json({ message: 'API de SITMAH funcionando' });
});

// Importar rutas
const programacionRoutes = require('./routes/programacionRoutes');
const aperturaRoutes = require('./routes/aperturaRoutes');

// Usar rutas
app.use('/api/programacion', programacionRoutes);
app.use('/api/apertura', aperturaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 