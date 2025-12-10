// src/service/incomeService.ts
import api from '../lib/api';

export interface Income {
  id?: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  source: string;
}

export const incomeService = {
  create: async (data: any) => {
    return api.post("/income", {
      value: data.amount, // 👈 nome correto conforme backend (value)
      description: data.description,
      date: data.date,
      category: data.category
    });
  },

  getAll: async () => {
    return api.get("/income");
  },

  getTotal: async () => {
    return api.get("/income/total");
  }
};
