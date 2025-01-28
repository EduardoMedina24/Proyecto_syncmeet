import { Link } from 'react-router-dom'; // Importar Link para navegar
import PropTypes from 'prop-types'; // Importar PropTypes
import './Navbar.css'; // Estilos específicos para el Navbar

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>SyncMeet</h1>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/auth?view=login">Login</Link> {/* Navegar a /auth con view=login */}
        </li>
        <li>
          <Link to="/auth?view=register">Registro</Link> {/* Navegar a /auth con view=register */}
        </li>
        <li>
          <Link to="/">Inicio</Link> {/* Navegar al inicio */}
        </li>
      </ul>
    </nav>
  );
}

// Validación de las propiedades
Navbar.propTypes = {
  setView: PropTypes.func.isRequired, // Validamos que setView sea una función obligatoria
};

export default Navbar;
