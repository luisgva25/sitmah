const mongoose = require('mongoose');

const programacionSchema = new mongoose.Schema({
    ruta: {
        type: String,
        required: [true, 'La ruta es obligatoria'],
        trim: true
    },
    horarios: [{
        hora: {
            type: String,
            required: [true, 'La hora es obligatoria']
        },
        corrida: {
            type: String,
            required: [true, 'La corrida es obligatoria']
        },
        apertura: {
            type: String,
            required: false
        },
        estado: {
            type: String,
            enum: ['pendiente', 'asignado', 'completado'],
            default: 'pendiente'
        }
    }],
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    programador: {
        type: String,
        required: [true, 'El ID del programador es obligatorio']
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Programacion', programacionSchema); 