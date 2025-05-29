const mongoose = require('mongoose');

const aperturaSchema = new mongoose.Schema({
    programacionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Programacion',
        required: [true, 'El ID de la programación es obligatorio']
    },
    tipoUnidad: {
        type: String,
        required: [true, 'El tipo de unidad es obligatorio'],
        enum: ['URBANO', 'SUBURBANO', 'INTERMUNICIPAL']
    },
    economico: {
        type: String,
        required: [true, 'El número económico es obligatorio'],
        trim: true
    },
    tarjeton: {
        type: String,
        required: [true, 'El número de tarjetón es obligatorio'],
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del operador es obligatorio'],
        trim: true
    },
    fechaApertura: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completado', 'cancelado'],
        default: 'pendiente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Apertura', aperturaSchema); 