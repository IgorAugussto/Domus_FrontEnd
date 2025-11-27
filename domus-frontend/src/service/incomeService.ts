import api from '../lib/api';

export interface Income {
  id?: string;
  description: string;
  amount: number;
  date: string;
}

export const incomeService = {
  getAll: async (): Promise<Income[]> => {
    const response = await api.get('/income');
    return response.data;
  },

  getTotal: async (): Promise<number> => {
    const response = await api.get('/income/total');
    return response.data; // ou response.data.total
  },

  create: async (income: Omit<Income, 'id'>): Promise<Income> => {
    const response = await api.post('/income', income);
    return response.data;
  }
};