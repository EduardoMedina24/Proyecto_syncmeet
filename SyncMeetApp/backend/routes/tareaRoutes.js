const express = require('express');
const { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea } = require('../controllers/tareaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, crearTarea);
router.get('/', authMiddleware, obtenerTareas);
router.put('/:id', authMiddleware, actualizarTarea);  // Editar tarea
router.delete('/:id', authMiddleware, eliminarTarea); // Eliminar tarea

module.exports = router;
