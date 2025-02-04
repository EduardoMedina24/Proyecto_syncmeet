import { Link } from "react-router-dom"; // Importar Link para navegar
import PropTypes from "prop-types"; // Importar PropTypes
import { Button } from "../ui/button";
import "./Navbar.css"; // Estilos específicos para el Navbar

function Navbar() {
  return (
    <header className="border-b w-full flex justify-center bg-[#bce9ab]">
      <div className="container flex h-16 items-center justify-between p-5 ">
        <h1 className="text-2xl font-bold tracking-tight">SyncMeet</h1>
        <nav className="flex gap-4">
          <Link to="/">
            <button className=" nav-btn bg-[#659255] py-2 px-4 rounded-md text-white ">
              Inicio
            </button>
          </Link>
          <Link to="/auth?view=register">
            <button className=" nav-btn bg-[#659255] py-2 px-4 rounded-md text-white text-base">
              Acceder
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Validación de las propiedades
Navbar.propTypes = {
  setView: PropTypes.func.isRequired, // Validamos que setView sea una función obligatoria
};

export default Navbar;
