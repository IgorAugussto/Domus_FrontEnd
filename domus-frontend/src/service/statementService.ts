import api from '../lib/api';

export const statementService = {
  import: async (file: File): Promise<{ total: number; saved: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/statement/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};