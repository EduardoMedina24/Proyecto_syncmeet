import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const Auth = () => {
  const [view, setView] = useState('login');
  const location = useLocation();

  useEffect(() => {
    // Detectar el parámetro de consulta `view` para determinar qué mostrar
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'register') {
      setView('register');
    } else {
      setView('login');
    }
  }, [location]);

  return view === 'login' ? <Login /> : <Register />;
};

export default Auth;
