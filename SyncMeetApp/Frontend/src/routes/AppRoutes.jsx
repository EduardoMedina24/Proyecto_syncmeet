import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} /> {/* Ruta de inicio */}
    <Route path="/auth" element={<Auth />} /> {/* Ruta de login y registro */}
  </Routes>
);

export default AppRoutes;
