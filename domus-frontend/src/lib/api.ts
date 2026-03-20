// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 👈 importante: sempre começar com /api
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
);

// 🧠 Função de delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// 🔁 Retry automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // se não tem config, não tenta retry
    if (!config) return Promise.reject(error);

    // número máximo de tentativas
    const MAX_RETRIES = 3;

    // cria contador se não existir
    config.__retryCount = config.__retryCount || 0;

    // só tenta novamente em erro de rede ou servidor
    const shouldRetry =
      !error.response || error.response.status >= 500;

    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount++;

      // backoff: 2s, 4s, 6s
      const waitTime = 2000 * config.__retryCount;

      console.log(`🔁 Retry ${config.__retryCount} em ${waitTime}ms`);

      await delay(waitTime);

      return api(config); // tenta novamente
    }

    return Promise.reject(error);
  }
);


export default api;
