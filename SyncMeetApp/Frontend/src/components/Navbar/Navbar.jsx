import { Link, useLocation } from 'react-router-dom'; // Importar useLocation
import PropTypes from 'prop-types';

import "./Navbar.css"; // Estilos específicos para el Navbar
import logo from "../../assets/logo2.png"; // Importar el logo
import { House, UserPlus } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/calendar"; // Verificar si estamos en la página del calendario

  return (
    <header className="border-b w-full bg-[#f9f9f9]">
      <div className="w-full flex h-16 items-center justify-between py-5 px-10 shadow-md">
        <img className="w-[130px]" src={logo} alt="Logo" />
        <nav className="flex gap-4">
          <Link to="/">
            <button className="flex gap-1 justify-center items-center font-semibold nav-btn bg-[#bee4db] py-2 px-4 rounded-3xl text-[#00684a] border-4 text-sm">
              <House size={20} />
              {isCalendarPage ? "Cerrar sesión" : "Inicio"} 
            </button>
          </Link>
          {!isCalendarPage && (
            <Link to="/auth?view=login">
              <button className="flex gap-1 justify-center items-center nav-btn bg-[#bee4db] rounded-3xl py-2 px-4 text-[#00684a] font-semibold border-4 text-sm">
                <UserPlus size={20} />
                Acceder
              </button>
            </Link>
          )}
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
