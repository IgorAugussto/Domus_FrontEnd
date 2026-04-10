import axios from 'axios';

export const statementService = {
  import: async (file: File): Promise<{ total: number; saved: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    // ✅ Chama o backend direto, sem passar pelo proxy do Vercel
    const response = await axios.post(
      'http://18.221.218.62:8080/api/statement/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};