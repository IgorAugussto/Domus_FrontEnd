import api from '../lib/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  type: string;
  email: string;
  name: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};