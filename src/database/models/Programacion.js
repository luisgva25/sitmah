const mongoose = require('mongoose');

const programacionSchema = new mongoose.Schema({
    ruta: {
        type: String,
        required: [true, 'La ruta es obligatoria'],
        trim: true
    },
<<<<<<< HEAD
    tipoVehiculo: {
        type: String,
        required: [true, 'El tipo de vehículo es obligatorio']
    },
    cantidadUnidades: {
        type: Number,
        required: [true, 'La cantidad de unidades es obligatoria']
    },
    kilometraje: {
        type: Number,
        required: [true, 'El kilometraje programado es obligatorio']
    },
    viajes: {
        type: Number,
        required: [true, 'Los viajes programados son obligatorios']
    },
=======
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
>>>>>>> 3a858bb5c56c47bad9f42f60221383b03c2dac30
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