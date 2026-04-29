import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosinstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosinstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosinstance.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosinstance.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (!error.response) {
      console.error("🌐 Network Error: The server is unreachable. Check if your backend is running on port 8000.");
      return Promise.reject({ message: "Server is unreachable. Please try again later." });
    }

    const { status, config } = error.response;

   
    if (status === 401) {
     
      if (config.url.includes('/login') || config.url.includes('/register')) {
        return Promise.reject(error);
      }

    
      console.error("Session expired. Redirecting to login...");
      localStorage.removeItem('user');
      
     
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 500) {
      console.error("🔥 Server Error (500):", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosinstance;


