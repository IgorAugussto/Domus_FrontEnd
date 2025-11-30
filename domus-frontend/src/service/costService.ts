import api from '../lib/api';

export interface Cost {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export const costService = {
  getAll: async (): Promise<Cost[]> => {
    const response = await api.get('/costs');
    return response.data;
  },

  getTotal: async (): Promise<number> => {
    const response = await api.get('/costs/total');
    return response.data;
  },

  create: async (cost: Omit<Cost, 'id'>): Promise<Cost> => {
    const response = await api.post('/costs', cost);
    return response.data;
  }
};