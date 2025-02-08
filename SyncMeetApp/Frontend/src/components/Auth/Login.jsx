import './Auth.css';
import TextLeft from '../Carousel/TextLeft';
import TextRight from '../Carousel/TextRight';
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";


const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Inicializa useNavigate
  const API_URL = import.meta.env.VITE_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

  
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (data.message === 'Login exitoso') {
        // alert('Inicio de sesión exitoso');
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
      
      <TextLeft currentIndex={currentIndex} className="text-left1" />

      {/* Formulario de Login */}
       
      <Card className="form-container">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

  <br />
  <form onSubmit={handleSubmit}>
    <div className="space-y-5">
      {/* Campo de Correo Electrónico */}
      <div className="space-y-2">
       
        <div className="flex items-center space-x-2">  {/* Contenedor Flex */}
  {/* Ícono de Correo */}
  <div className="text-muted-foreground/80">
    <Mail size={18} strokeWidth={2} aria-hidden="true" />
  </div>
  {/* Input de Correo */}
  <Input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Correo Electrónico"
    type="email"
    required
    className="border p-2"
  />
</div>

      </div>

      {/* Campo de Contraseña */}
      <div className="space-y-2">
       
        <div className="flex items-center space-x-2">  {/* Contenedor Flex */}
  {/* Ícono de Contraseña */}
  <div className="text-muted-foreground/80">
    <Lock size={18} strokeWidth={2} aria-hidden="true" />
  </div>
  {/* Input de Contraseña */}
  <Input
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Contraseña"
    type="password"
    required
    className="border p-2"
  />
</div>
      </div>
    </div>

    <button
      type="submit"
      className="form-action-btn bg-[#31a58f] text-white p-1 font-bold border-transparent border-solid border-2 rounded-md"
    >
      Entrar
    </button>

    {error && <p className="error-message">{error}</p>}

    <p>
      ¿No tienes cuenta?{" "}
      <Link to="/auth?view=register" className="link">
        Regístrate
      </Link>
    </p>
  </form>
</Card>






      {/* Textos a la derecha */}
      <TextRight currentIndex={currentIndex} />
    </div>
  );
}

export default Login;
