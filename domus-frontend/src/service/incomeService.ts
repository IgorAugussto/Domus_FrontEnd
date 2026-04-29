// src/service/incomeService.ts
import api from '../lib/api';

export interface Income {
  id?: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  frequency: string;
  recurring: boolean;
  category: string;
}

export const incomeService = {
  create: async (data: any) => {
    return api.post("/income", {
      value: data.amount,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,      // ✅
      recurring: data.recurring,
      category: data.category,
      frequency: data.frequency
    });
  },

  getAll: async () => {
    const response = await api.get("/income?size=9999");
    return response.data.content ?? [];
  },

  getTotal: async () => {
    const response = await api.get("/income/total");
    return response.data;
  },

  update: async (id: number, data: any) => {
    return api.put(`/income/${id}`, {
      value: data.amount,
      description: data.description,
      startDate: data.startDate,
      category: data.category,
      frequency: data.frequency,
    });
  },

  delete: async (id: number) => {
    return api.delete(`/income/${id}`);
  },
};

