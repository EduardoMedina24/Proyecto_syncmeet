const express = require('express');
const { crearTarea, obtenerTareas } = require('../controllers/tareaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para crear una nueva tarea (requiere autenticación)
router.post('/', authMiddleware, crearTarea);

// Ruta para obtener tareas del usuario autenticado
router.get('/', authMiddleware, obtenerTareas);

module.exports = router;
