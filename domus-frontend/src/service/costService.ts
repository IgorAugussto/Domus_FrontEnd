import api from '../lib/api';

export interface Cost {
  id: string;
  description: string;
  value: number;
  startDate: string;
  category: string;
  frequency: string;
  durationMonths: number;
}

export const costService = {
  create: async (data: any) => {
    return api.post("/costs", {
      value: data.amount,
      description: data.description,
      startDate: data.startDate,
      category: data.category,
      frequency: data.frequency,
      durationMonths: data.durationMonths
    });
  },

  getAll: async () => {
    const response = await api.get("/costs");
    return response.data; // 👈 AQUI ESTAVA O ERRO DO DASHBOARD
  },

  getTotal: async () => {
    const response = await api.get("/costs/total");
    return response.data;
  }
};