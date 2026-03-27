import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
});

// 🔹 Adiciona o token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

    // 👇 Se token expirou ou sem permissão, redireciona para login
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!config) return Promise.reject(error);

    const MAX_RETRIES = 3;
    config.__retryCount = config.__retryCount || 0;

    const shouldRetry = !error.response || error.response.status >= 500;

    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount++;
      const waitTime = 2000 * config.__retryCount;
      console.log(`🔁 Retry ${config.__retryCount} em ${waitTime}ms`);
      await delay(waitTime);
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;