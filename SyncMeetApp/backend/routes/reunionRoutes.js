const express = require('express');
const { crearReunion, obtenerReuniones } = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para crear una nueva reunión (requiere autenticación)
router.post('/', authMiddleware, crearReunion);

// Ruta para obtener reuniones de un usuario autenticado
router.get('/', authMiddleware, obtenerReuniones);

module.exports = router;
