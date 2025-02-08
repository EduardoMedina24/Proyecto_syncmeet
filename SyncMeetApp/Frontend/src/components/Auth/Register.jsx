import './Auth.css';
import TextLeft from '../Carousel/TextLeft';
import TextRight from '../Carousel/TextRight';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import { User, Mail, Lock } from 'lucide-react'; // Importa los íconos

function Register() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Corregir la declaración de estado
  const API_URL = import.meta.env.VITE_APP_API_URL;

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Registro exitoso');
        // Limpiar los campos del formulario
        setName('');
        setEmail('');
        setPassword('');
        setError('');  // Limpiar el mensaje de error si lo hubo
        // Aquí puedes redirigir o realizar otras acciones
      } else {
        setError(data.message || 'Hubo un problema al registrar tu cuenta. Intenta nuevamente.');
      }
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al registrarte. Intenta nuevamente.');
    }
  };
  
  

  // Cambiar el índice automáticamente cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // Cambia al siguiente índice
    }, 3000); // Cada 3 segundos (3000ms)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="auth-container register-container">
      {/* Textos a la izquierda */}
      <TextLeft currentIndex={currentIndex} />

      {/* Formulario de Registro */}
      

{/* Formulario de Registro */}
<div className="form-container">
  <h2 className="text-2xl font-bold text-center">Registro</h2>
  <br />
  <form onSubmit={handleSubmit}>
    {/* Campo Nombre */}
    <div className="flex items-center space-x-2">
      {/* Ícono de Nombre */}
      <div className="text-muted-foreground/80">
        <User size={18} strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
       
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Actualiza el estado del nombre
          placeholder="Ingresa tu nombre"
          required
        />
      </div>
    </div>

    {/* Campo Correo Electrónico */}
    <div className="flex items-center space-x-2">
      {/* Ícono de Correo */}
      <div className="text-muted-foreground/80">
        <Mail size={18} strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
       
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
          placeholder="Ingresa tu correo"
          required
        />
      </div>
    </div>

    {/* Campo Contraseña */}
    <div className="flex items-center space-x-2">
      {/* Ícono de Contraseña */}
      <div className="text-muted-foreground/80">
        <Lock size={18} strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
    
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
          placeholder="Crea una contraseña"
          required
        />
      </div>
    </div>

    <button type="submit" className="button register">Registrar</button>

    <p>¿Ya tienes cuenta? <Link to="/auth?view=login" className="link">Inicia sesión</Link></p>

    {/* Mostrar mensaje de error si hay */}
    {error && <p className="error-message">{error}</p>}
  </form>
</div>


      {/* Textos a la derecha */}
      <TextRight currentIndex={currentIndex} />
    </div>
  );
}

export default Register;
