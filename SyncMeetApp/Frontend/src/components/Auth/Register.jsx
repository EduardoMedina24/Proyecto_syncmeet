import "./Auth.css";
import TextLeft from "../Carousel/TextLeft";
import TextRight from "../Carousel/TextRight";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importar Link
import { Card } from "../ui/card";
import { Mail, User, Lock } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast, Toaster } from "sonner";
function Register() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Corregir la declaración de estado

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registro exitoso"); // Mostrar mensaje de éxito
        // Limpiar los campos del formulario
        setName("");
        setEmail("");
        setPassword("");
        setError(""); // Limpiar el mensaje de error si lo hubo
        // Aquí puedes redirigir o realizar otras acciones
      } else {
        toast.error("Ha habido un problema al registrarte"); // Mostrar mensaje de error
        setError(
          data.message ||
            "Hubo un problema al registrar tu cuenta. Intenta nuevamente."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Hubo un problema al registrarte. Intenta nuevamente.");
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
    <>
    <Toaster position="top-center" richColors />
    <div className="auth-container register-container">
      {/* Textos a la izquierda */}
      {/*<TextLeft currentIndex={currentIndex} />*/}

      {/* Formulario de Registro */}
      <Card className="form-container">
        <h2 className="text-2xl font-bold">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 ">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre:</Label>
              <div className="relative">
                {/*<label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)} // Actualiza el estado del nombre
                placeholder="Ingresa tu nombre"
                required
              />*/}
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Actualiza el estado del nombre
                  className="peer ps-9"
                  placeholder="Ingresa tu nombre"
                  type="text"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <User size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>
            </div>
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
              {/* <Label htmlFor="email">Correo Electrónico:</Label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                placeholder="Ingresa tu correo"
                required
              /> */}
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
                {/* <label htmlFor="password">Contraseña:</label>
              <input
              type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
                placeholder="Crea una contraseña"
                required
              /> */}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="form-action-btn  bg-[#31a58f] text-white  p-1 font-bold border-transparent border-solid border-2 rounded-md"
          >
            Registrar
          </button>

          <p>
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth?view=login" className="link">
              Inicia sesión
            </Link>
          </p>
          {/* Mostrar mensaje de error si hay */}

          {error && <p className="error-message">{error}</p>}
        </form>
      </Card>

      {/* Textos a la derecha */}
      {/*<TextRight currentIndex={currentIndex} />*/}
    </div>
</> 
  );
}

export default Register;
