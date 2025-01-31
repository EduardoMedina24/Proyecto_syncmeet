const Reunion = require('../models/Reunion');

const crearReunion = async (req, res) => {
    const { titulo, descripcion, fechaInicio, fechaFin } = req.body;
  
    try {
      console.log('Datos recibidos:', { titulo, descripcion, fechaInicio, fechaFin }); // Verifica los datos recibidos
      const nuevaReunion = new Reunion({
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        usuario: req.user.userId, // Asociar la reunión al usuario autenticado
      });
  
      await nuevaReunion.save();
      return res.status(201).json({ success: true, reunion: nuevaReunion });
    } catch (error) {
      console.error('Error al crear reunión:', error); // Añadir más detalles del error
      return res.status(500).json({ success: false, message: 'Error al crear la reunión', error });
    }
  };
  

const obtenerReuniones = async (req, res) => {
  try {
    const reuniones = await Reunion.find({ usuario: req.user.userId });
    res.status(200).json(reuniones);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las reuniones', error });
  }
};

module.exports = { crearReunion, obtenerReuniones };
