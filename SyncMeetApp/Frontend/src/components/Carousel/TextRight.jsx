import PropTypes from 'prop-types';
import './Carousel.css';
import Img1 from '../../assets/img/Designer (10).jpeg';
import Img2 from '../../assets/img/Designer (9).jpeg';
import Img3 from '../../assets/img/Designer (7).jpeg';
import Img4 from '../../assets/img/Designer (6).jpeg';

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
              <img src={Img1} alt="Descripción 1" />
              <p>Organiza</p>
            </div>
            <div className="card">
              <img src={Img2}alt="Descripción 2" />
              <p>Conecta</p>
            </div>
            <div className="card">
              <img src={Img4} alt="Descripción 3" />
              <p>Gestiona</p>
            </div>
            <div className="card">
              <img src={Img3} alt="Descripción 4" />
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
