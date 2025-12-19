import api from '../lib/api';

export interface MonthlyProjection {
  month: string;
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
  getProjection: async (): Promise<MonthlyProjection[]> => {
    const response = await api.get("/dashboard/projection");
    return response.data;
  },
};
