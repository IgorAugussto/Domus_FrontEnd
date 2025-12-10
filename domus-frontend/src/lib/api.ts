// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // 👈 importante: sempre começar com /api
  timeout: 10000,
});

// 🔹 Adiciona o token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token salvo após login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
