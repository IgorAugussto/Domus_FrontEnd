// src/service/incomeService.ts
import api from '../lib/api';

export interface Income {
  id?: string;
  description: string;
  value: number;
  date: string;
  category: string;
}

export const incomeService = {
  create: async (data: any) => {
    return api.post("/income", {
      value: data.amount,
      description: data.description,
      date: data.date,
      category: data.category,
      frequency: data.frequency
    });
  },

  getAll: async () => {
    const response = await api.get("/income");
    return response.data; // 👈 AQUI ESTAVA O ERRO DO DASHBOARD
  },

  getTotal: async () => {
    const response = await api.get("/income/total");
    return response.data;
  }
};

