import axios from 'axios';

// Configurar la base URL del backend
const API_URL = 'http://localhost:5000/api/users'; // Asegúrate de que coincide con el backend

export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios', error);
    throw error;
  }
};
