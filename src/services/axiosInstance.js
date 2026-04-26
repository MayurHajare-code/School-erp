

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //render api of backend
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },

});

export default axiosInstance;



// VITE_API_BASE_URL=http://localhost:8080/api    get from .env file