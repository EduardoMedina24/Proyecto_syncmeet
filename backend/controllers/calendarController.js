const Reunion = require('../models/Reunion');
const crearReunion = async (req, res) => {
    const { titulo,descripcion, fechaInicio, fechaFin } = req.body;

    // Crear una URL única de Jitsi Meet para la reunión
    const urlReunion = `https://meet.jit.si/${Math.random().toString(36).substring(7)}`;
console.log('URL de la reunión generada:', urlReunion);

    try {
        console.log('Datos recibidos:', { titulo, descripcion, urlReunion,fechaInicio, fechaFin });
        const nuevaReunion = new Reunion({
            titulo,
            descripcion,
            fechaInicio,
            fechaFin,
            usuario: req.user.userId,
            urlReunion, // Asignar la URL de la reunión virtual
        });

        await nuevaReunion.save();
        return res.status(201).json({ success: true, reunion: nuevaReunion });
    } catch (error) {
        console.error('Error al crear reunión:', error);
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
