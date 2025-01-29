const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Crear usuario con encriptación de contraseña
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'Usuario creado', user: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al crear el usuario', error });
  }
};


// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Evita enviar la contraseña en la respuesta
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};


// Iniciar sesión y devolver un token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔍 Datos recibidos:', { email, password });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario encontrado:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Login exitoso');
    return res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('❌ Error en el inicio de sesión:', error);
    return res.status(500).json({ message: 'Error en el inicio de sesión', error });
  }
};

    
module.exports = {
  createUser,
  getUsers,
  loginUser,
};
