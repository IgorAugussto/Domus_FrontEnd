// src/services/investmentService.ts
import api from '../lib/api';

// Interface baseada no seu InvestmentsRequest/Response
export interface Investment {
  id?: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  typeInvestments: string;        // opcional, se tiver
  expectedReturn: number; // opcional
}

// Dados que você envia pro back
export const investmentService = {
  create: async (data: any) => {
    return api.post("/investments", {
      value: data.amount,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      typeInvestments: data.type,
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
  },

  update: async (id: number, data: any) => {
      return api.put(`/investments/${id}`, {
        value: data.amount,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        category: data.category,
        typeInvestments: data.type,
        expectedReturn: data.expectedReturn
      });
    },
  
    delete: async (id: number) => {
      return api.delete(`/investments/${id}`);
    },
};
