import { useState } from 'react'; // Para manejar el estado del índice actual
import Carousel from '../components/Carousel/Carousel';
import TextLeft from '../components/Carousel/TextLeft';
import TextRight from '../components/Carousel/TextRight';
import { useEffect } from "react";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para el índice actual del texto

  // Función para actualizar el índice (puedes conectarla a un carrusel real si lo tienes)
  const updateIndex = (index) => {
    setCurrentIndex(index % 3); // Asegúrate de que el índice esté en el rango correcto
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="carousel-wrapper">
      <TextLeft currentIndex={currentIndex} /> {/* Pasar el currentIndex a TextLeft */}
      <div className="carousel">
      <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "black" }}>
          Bienvenido a SyncMeet
      </h1>

        <br />
        
        <Carousel updateIndex={updateIndex} /> {/* Puedes conectar el índice aquí */}
      </div>
      <TextRight currentIndex={currentIndex} /> {/* Pasar el currentIndex a TextRight */}
    </div>
  );
};

export default Home;
