const express = require('express');
const { crearReunion, obtenerReuniones, actualizarReunion, eliminarReunion } = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, crearReunion);
router.get('/', authMiddleware, obtenerReuniones);
router.put('/:id', authMiddleware, actualizarReunion);  // Editar reunión
router.delete('/:id', authMiddleware, eliminarReunion); // Eliminar reunión

module.exports = router;
