const express = require('express');
const { createUser, getUsers, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas de usuarios
router.post('/', createUser); // Crear un nuevo usuario
router.get('/', getUsers);    // Obtener todos los usuarios
router.get('/', authMiddleware, getUsers); 
router.post('/login', loginUser);
// Ruta para registrar un nuevo usuario
router.post('/register', createUser);



module.exports = router;
