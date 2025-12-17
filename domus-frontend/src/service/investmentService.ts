// src/services/investmentService.ts
import api from '../lib/api';

// Interface baseada no seu InvestmentsRequest/Response
export interface Investment {
  id?: string;
  description: string;
  value: number;
  date: string;
  type?: string;        // opcional, se tiver
  expectedReturn?: number; // opcional
}

// Dados que você envia pro back
export const investmentService = {
  create: async (data: any) => {
    return api.post("/investments", {
      value: data.amount,
      description: data.description,
      date: data.date,
      type: data.type,
      expectedReturn: data.expectedReturn
    });
  },

  getAll: async () => {
    const response = await api.get("/investments");
    return response.data; // 👈 AQUI ESTAVA O ERRO DO DASHBOARD
  },

  getTotal: async () => {
    const response = await api.get("/investments/total");
    return response.data;
  }
};
