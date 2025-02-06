import './Auth.css';
import TextLeft from '../Carousel/TextLeft';
import TextRight from '../Carousel/TextRight';
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
      <TextLeft currentIndex={currentIndex} />

      {/* Formulario de Login */}
      <Card className="form-container">
        <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico:</Label>
              <div className="relative">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                  className="peer ps-9"
                  placeholder="Ingresa tu correo"
                  type="email"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Mail size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña:</Label>
              <div className="relative">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
                  className="peer ps-9"
                  placeholder="Crea una contraseña"
                  type="password"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Lock size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="form-action-btn  bg-[#31a58f] text-white  p-1 font-bold border-transparent border-solid border-2 rounded-md "
          >
            Entrar
          </button>

          {/* Mostrar mensaje de error */}
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
