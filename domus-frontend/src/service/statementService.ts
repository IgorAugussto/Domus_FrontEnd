import api from '../lib/api';

export const statementService = {
  import: async (
    file: File,
    dueDate: string
  ): Promise<{ total: number; saved: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dueDate', dueDate);

    // ✅ Remove o Content-Type manual — axios define automaticamente com o boundary correto
    const response = await api.post('/statement/import', formData);

    return response.data;
  },
};