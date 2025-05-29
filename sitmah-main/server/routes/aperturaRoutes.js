const express = require('express');
const router = express.Router();
const Apertura = require('../../src/database/models/Apertura');

// Obtener todas las aperturas
router.get('/', async (req, res) => {
    try {
        const aperturas = await Apertura.find()
            .populate('programacionId')
            .sort({ fechaApertura: -1 });
        res.json(aperturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva apertura
router.post('/', async (req, res) => {
    const apertura = new Apertura(req.body);
    try {
        const nuevaApertura = await apertura.save();
        res.status(201).json(nuevaApertura);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener una apertura específica
router.get('/:id', async (req, res) => {
    try {
        const apertura = await Apertura.findById(req.params.id)
            .populate('programacionId');
        if (apertura) {
            res.json(apertura);
        } else {
            res.status(404).json({ message: 'Apertura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar una apertura
router.put('/:id', async (req, res) => {
    try {
        const apertura = await Apertura.findById(req.params.id);
        if (apertura) {
            Object.assign(apertura, req.body);
            const aperturaActualizada = await apertura.save();
            res.json(aperturaActualizada);
        } else {
            res.status(404).json({ message: 'Apertura no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar una apertura
router.delete('/:id', async (req, res) => {
    try {
        const apertura = await Apertura.findById(req.params.id);
        if (apertura) {
            await apertura.remove();
            res.json({ message: 'Apertura eliminada' });
        } else {
            res.status(404).json({ message: 'Apertura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 