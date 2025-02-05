const Tarea = require('../models/Tarea');

const crearTarea = async (req, res) => {
    const { titulo, descripcion, fecha } = req.body;

    try {
        const nuevaTarea = new Tarea({
            titulo,
            descripcion,
            fecha,
            usuario: req.user.userId,  // Asignar la tarea al usuario autenticado
        });

        await nuevaTarea.save();
        return res.status(201).json({ success: true, tarea: nuevaTarea });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        return res.status(500).json({ success: false, message: 'Error al crear la tarea', error });
    }
};

const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario: req.user.userId });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las tareas', error });
  }
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha } = req.body;

  try {
      const tarea = await Tarea.findOneAndUpdate(
          { _id: id, usuario: req.user.userId },
          { titulo, descripcion, fecha },
          { new: true }
      );

      if (!tarea) {
          return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
      }

      res.status(200).json({ success: true, tarea });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar la tarea', error });
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  try {
      const tarea = await Tarea.findOneAndDelete({ _id: id, usuario: req.user.userId });

      if (!tarea) {
          return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
      }

      res.status(200).json({ success: true, message: 'Tarea eliminada' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar la tarea', error });
  }
};

module.exports = { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea };
