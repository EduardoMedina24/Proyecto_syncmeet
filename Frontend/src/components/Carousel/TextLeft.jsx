import PropTypes from 'prop-types';
import './Carousel.css';

function TextLeft({ currentIndex }) {
  const textsLeft = [
    "📅 Programar reuniones públicas o privadas con facilidad.",
    "✅ Asignar tareas y mantener un seguimiento claro de las responsabilidades.",
    "🕒 Visualizar fechas y horarios en un calendario intuitivo, con detalles clave sobre cada reunión.",
  ];

  return (
    <div className="text-left">
      <h3>{textsLeft[currentIndex]}</h3>
    </div>
  );
}

// Validación de las props
TextLeft.propTypes = {
  currentIndex: PropTypes.number.isRequired, // currentIndex debe ser un número
};

export default TextLeft;
