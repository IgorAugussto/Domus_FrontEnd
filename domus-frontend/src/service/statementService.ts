import api from '../lib/api';

export const statementService = {
  import: async (
    file: File,
    dueDate: string  // ✅ data de vencimento no formato yyyy-MM-dd
  ): Promise<{ total: number; saved: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dueDate', dueDate); // ✅ envia a data junto com o arquivo

    const response = await api.post('/statement/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};