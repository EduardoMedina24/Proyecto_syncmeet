import { BrowserRouter as Router } from 'react-router-dom'; // Importar Router
import './styles/App.css'; // Estilos generales

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <AppRoutes /> {/* Aquí gestionamos todas las rutas */}
      </main>
      <Footer />
    </Router>
  );
}

export default App;
