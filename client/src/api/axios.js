import axios from "axios";
import { API_URL } from "../config";

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar erroress
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Manejar logout si el token es inválido
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;