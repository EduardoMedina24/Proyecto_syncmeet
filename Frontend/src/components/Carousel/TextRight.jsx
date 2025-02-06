import PropTypes from 'prop-types';
import './Carousel.css';

function TextRight({ currentIndex }) {
  const textsRight = [
    "Descubre una nueva forma de organizarte con nuestra plataforma dinámica, diseñada para simplificar tus reuniones y tareas. ",
    "Descubre una nueva forma de organizarte con nuestra plataforma dinámica, diseñada para simplificar tus reuniones y tareas. ",
    "Descubre una nueva forma de organizarte con nuestra plataforma dinámica, diseñada para simplificar tus reuniones y tareas. ",
  ];

  return (
    <>
      <div className="text-right">
      <h3>{textsRight[currentIndex]}</h3>
      <br />
        <div className="card-container">
            <div className="card">
              <img src="https://picsum.photos/103" alt="Descripción 1" />
              <p>Organiza</p>
            </div>
            <div className="card">
              <img src="https://picsum.photos/104"alt="Descripción 2" />
              <p>Conecta</p>
            </div>
            <div className="card">
              <img src="https://picsum.photos/105" alt="Descripción 3" />
              <p>Gestiona</p>
            </div>
            <div className="card">
              <img src="https://picsum.photos/106" alt="Descripción 4" />
              <p>Simplifica</p>
            </div>
        </div>
      </div>
    

    </>

  );
}

// Validación de las props
TextRight.propTypes = {
  currentIndex: PropTypes.number.isRequired, // currentIndex debe ser un número
};

export default TextRight;
