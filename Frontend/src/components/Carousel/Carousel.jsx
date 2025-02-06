import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import './Carousel.css';

function Carousel({ setCurrentIndex }) {
  const images = [
    'https://images.unsplash.com/photo-1593642634367-d91a135587b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjYyOXwwfDF8c2VhY2h8MXx8Y2Fyb3VzZWx8ZW58MHx8fHwxNjY0MzY1Njc3&ixlib=rb-1.2.1&q=80&w=1080',
    'https://picsum.photos/300',
    'https://picsum.photos/503',
  ];

  const [currentIndexLocal, setCurrentIndexLocal] = useState(0);

  const nextSlide = () => {
    const newIndex = (currentIndexLocal + 1) % images.length;
    setCurrentIndexLocal(newIndex);
    setCurrentIndex(newIndex); // Se pasa el índice al componente principal
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [currentIndexLocal]);

  return (
    <div className="carousel-container">
      <div className="carousel-slide">
        <img src={images[currentIndexLocal]} alt={`Slide ${currentIndexLocal}`} className="carousel-image" />
      </div>
      <div className="carousel-controls">
        <button className="carousel-prev" onClick={() => nextSlide()}>❮</button>
        <button className="carousel-next" onClick={() => nextSlide()}>❯</button>
      </div>
    </div>
  );
}

// Validación de las props
Carousel.propTypes = {
  setCurrentIndex: PropTypes.func.isRequired, // setCurrentIndex debe ser una función
};

export default Carousel;
