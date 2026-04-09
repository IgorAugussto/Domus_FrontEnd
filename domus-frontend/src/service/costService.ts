import api from '../lib/api';

export type PaymentType = "Cartão de Crédito" | "Boleto";

export interface Cost {
  id: string;
  description: string;
  value: number;
  startDate: string;
  category: string;
  frequency: string;
  durationInMonths: number;
  paymentType: PaymentType;
  paid: boolean;
}

export const costService = {
  create: async (data: any) => {
    return api.post("/costs", {
      value: data.amount,
      description: data.description,
      startDate: data.startDate,
      category: data.category,
      frequency: data.frequency,
      durationInMonths: data.durationInMonths,
      paymentType: data.paymentType,
      paid: data.paid ?? false,
    });
  },

  getAll: async () => {
    const response = await api.get("/costs");
    return response.data;
  },

  getTotal: async () => {
    const response = await api.get("/costs/total");
    return response.data;
  },

  update: async (id: number, data: any) => {
    console.log("ID:", id, typeof id);
    console.log("DATA COMPLETO:", JSON.stringify(data));
    const payload = {
      value: data.amount ?? data.value,  // ✅ prioriza amount (novo valor do modal)
      description: data.description,
      startDate: data.startDate,
      category: data.category,
      frequency: data.frequency,
      durationInMonths: data.durationInMonths,
      paymentType: data.paymentType,
      paid: data.paid,
    };
    console.log("PAYLOAD ENVIADO:", JSON.stringify(payload));
    return api.put(`/costs/${id}`, payload);
  },

  delete: async (id: number) => {
    return api.delete(`/costs/${id}`);
  },
};