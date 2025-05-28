const express = require('express');
const router = express.Router();
const Programacion = require('../../src/database/models/Programacion');

// Obtener todas las programaciones
router.get('/', async (req, res) => {
    try {
        const programaciones = await Programacion.find().sort({ fechaCreacion: -1 });
        res.json(programaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva programación
router.post('/', async (req, res) => {
    const programacion = new Programacion(req.body);
    try {
        const nuevaProgramacion = await programacion.save();
        res.status(201).json(nuevaProgramacion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener una programación específica
router.get('/:id', async (req, res) => {
    try {
        const programacion = await Programacion.findById(req.params.id);
        if (programacion) {
            res.json(programacion);
        } else {
            res.status(404).json({ message: 'Programación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar una programación
router.put('/:id', async (req, res) => {
    try {
        const programacion = await Programacion.findById(req.params.id);
        if (programacion) {
            Object.assign(programacion, req.body);
            const programacionActualizada = await programacion.save();
            res.json(programacionActualizada);
        } else {
            res.status(404).json({ message: 'Programación no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar una programación
router.delete('/:id', async (req, res) => {
    try {
        const programacion = await Programacion.findById(req.params.id);
        if (programacion) {
            await programacion.remove();
            res.json({ message: 'Programación eliminada' });
        } else {
            res.status(404).json({ message: 'Programación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 