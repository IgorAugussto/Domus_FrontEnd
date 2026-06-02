import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  withCredentials: true, // envia o cookie jwt automaticamente em toda request
});

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
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
