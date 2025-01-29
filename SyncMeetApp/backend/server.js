require('dotenv').config(); // Carga variables de entorno desde .env
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');



// Middleware para procesar JSON
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas
// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((error) => console.error('Error al conectar con MongoDB Atlas:', error.message));

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Ruta simple de prueba
app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});
