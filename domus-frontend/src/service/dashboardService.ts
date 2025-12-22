import api from '../lib/api';

export interface MonthlyProjection {
  month: string;
  income: number;
  expenses: number;
  investments: number;
}

// Tipos usados no gráfico
export interface YearlyProjection {
  period: string;        // "2025-01" ou "2025-01-15"
  income: number;
  expenses: number;
  investments: number;
}

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

   // 🔥 NOVO MÉTODO
  getMonthlyProjection: async (): Promise<MonthlyProjection[]> => {
    const response = await api.get("/dashboard/projection/month");
    return response.data;
  },

  getYearlyProjection: async (): Promise<YearlyProjection[]> => {
    const response = await api.get("/dashboard/projection/year");
    return response.data;
  },
};
