import { useState } from 'react'; // Para manejar el estado del índice actual
import Carousel from '../components/Carousel/Carousel';
import TextLeft from '../components/Carousel/TextLeft';
import TextRight from '../components/Carousel/TextRight';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para el índice actual del texto

  // Función para actualizar el índice (puedes conectarla a un carrusel real si lo tienes)
  const updateIndex = (index) => {
    setCurrentIndex(index % 3); // Asegúrate de que el índice esté en el rango correcto
  };

  return (
    <div className="carousel-wrapper">
      <TextLeft currentIndex={currentIndex} /> {/* Pasar el currentIndex a TextLeft */}
      <div className="carousel">
        <h3>Bienvenido a SyncMeet</h3>
        <p>Plataforma para programar y gestionar reuniones.</p>
        <Carousel updateIndex={updateIndex} /> {/* Puedes conectar el índice aquí */}
      </div>
      <TextRight currentIndex={currentIndex} /> {/* Pasar el currentIndex a TextRight */}
    </div>
  );
};

export default Home;
