const API_URL = 'http://localhost:5000/api';

// Servicio para programaciones
export const programacionService = {
    // Obtener todas las programaciones
    async getAll() {
        const response = await fetch(`${API_URL}/programacion`);
        if (!response.ok) {
            throw new Error('Error al obtener programaciones');
        }
        return response.json();
    },

    // Crear una nueva programación
    async create(data) {
        const response = await fetch(`${API_URL}/programacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al crear programación');
        }
        return response.json();
    },

    // Actualizar una programación
    async update(id, data) {
        const response = await fetch(`${API_URL}/programacion/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar programación');
        }
        return response.json();
    },

    // Eliminar una programación
    async delete(id) {
        const response = await fetch(`${API_URL}/programacion/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar programación');
        }
        return response.json();
    }
};

// Servicio para aperturas
export const aperturaService = {
    // Obtener todas las aperturas
    async getAll() {
        const response = await fetch(`${API_URL}/apertura`);
        if (!response.ok) {
            throw new Error('Error al obtener aperturas');
        }
        return response.json();
    },

    // Crear una nueva apertura
    async create(data) {
        const response = await fetch(`${API_URL}/apertura`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al crear apertura');
        }
        return response.json();
    },

    // Actualizar una apertura
    async update(id, data) {
        const response = await fetch(`${API_URL}/apertura/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar apertura');
        }
        return response.json();
    },

    // Eliminar una apertura
    async delete(id) {
        const response = await fetch(`${API_URL}/apertura/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar apertura');
        }
        return response.json();
    }
}; 