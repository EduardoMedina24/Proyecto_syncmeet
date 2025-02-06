const mongoose = require('mongoose');

const reunionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  urlReunion: {
    type: String,  // Asegúrate de que sea String
    required: true,  // Si es obligatorio
  },
});

const Reunion = mongoose.model('Reunion', reunionSchema);

module.exports = Reunion;
