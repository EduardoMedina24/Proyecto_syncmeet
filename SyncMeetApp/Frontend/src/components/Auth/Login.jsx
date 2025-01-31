import './Auth.css';
import TextLeft from '../Carousel/TextLeft';
import TextRight from '../Carousel/TextRight';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Inicializa useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (data.message === 'Login exitoso') {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('token', data.token); // Guarda el token en el localStorage
        navigate('/calendar');  // Redirige al calendario después del login
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al autenticarte. Intenta nuevamente.');
    }
  };
  
  

  // Cambiar el índice automáticamente cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="auth-container">
      {/* Textos a la izquierda */}
      <TextLeft currentIndex={currentIndex} />

      {/* Formulario de Login */}
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="button login">Entrar</button>

          {/* Mostrar mensaje de error */}
          {error && <p className="error-message">{error}</p>}

          <p>¿No tienes cuenta? <Link to="/auth?view=register" className="link">Regístrate</Link></p>
        </form>
      </div>

      {/* Textos a la derecha */}
      <TextRight currentIndex={currentIndex} />
    </div>
  );
}

export default Login;
