import { Link, useLocation } from 'react-router-dom'; // Importar useLocation
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isCalendarPage = location.pathname === '/calendar'; // O la ruta exacta de tu página del calendario

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>SyncMeet</h1>
      </div>
      <ul className="navbar-menu">
        {/* Mostrar Login y Registro solo si no estás en la página del calendario */}
        {!isCalendarPage && (
          <>
            <li>
              <Link to="/auth?view=login">Login</Link>
            </li>
            <li>
              <Link to="/auth?view=register">Registro</Link>
            </li>
          </>
        )}
        <li>
          {isCalendarPage ? (
            <Link to="/">Cerrar sesión</Link> // Muestra "Cerrar sesión" si estás en la página del calendario
          ) : (
            <Link to="/">Inicio</Link> // Muestra "Inicio" en el resto de las páginas
          )}
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default Navbar;
