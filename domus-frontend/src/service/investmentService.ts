// src/services/investmentService.ts
import api from '../lib/api';

// Interface baseada no seu InvestmentsRequest/Response
export interface Investment {
  id?: string;
  description: string;
  amount: number;
  date: string;
  type?: string;        // opcional, se tiver
  expectedReturn?: number; // opcional
}

// Dados que você envia pro back
export interface CreateInvestmentRequest {
  description: string;
  amount: number;
  date: string;
  type?: string;
  expectedReturn?: number;
}

export const investmentService = {
  // GET /api/investments → lista todos
  getAll: async (): Promise<Investment[]> => {
    const response = await api.get('/investments');
    return response.data; // retorna List<InvestmentsResponse>
  },

  // GET /api/investments/total → total investido
  getTotal: async (): Promise<number> => {
    const response = await api.get('/investments/total');
    return Number(response.data); // BigDecimal → number
  },

  // POST /api/investments → cria novo
  create: async (investment: CreateInvestmentRequest): Promise<Investment> => {
    const response = await api.post('/investments', investment);
    return response.data; // retorna InvestmentsResponse
  },
};