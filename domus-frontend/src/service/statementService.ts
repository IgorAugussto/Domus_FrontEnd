import api from '../lib/api';

// ── Tipos de resposta ─────────────────────────────────────────────────────────

/** Resposta imediata do POST /api/statement/import (HTTP 202) */
export interface StatementJobStarted {
  jobId: string;
}

/** Status atual do job (polling) */
export type JobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface StatementJobStatus {
  status: JobStatus;
  result: {
    total: number;
    saved: number;
    skipped: number;
    errors: string[];
  } | null;
}

// ── Serviço ───────────────────────────────────────────────────────────────────

export const statementService = {

  /**
   * Envia o arquivo e a data de vencimento.
   * O backend responde IMEDIATAMENTE com 202 + { jobId }.
   * O processamento acontece em background via RabbitMQ.
   */
  import: async (file: File, dueDate: string): Promise<StatementJobStarted> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dueDate', dueDate);

    const response = await api.post('/statement/import', formData);
    return response.data; // { jobId: "uuid" }
  },

  /**
   * Consulta o status de um job de importação.
   * Usar em polling (ex: a cada 2 segundos).
   *
   * status: "PENDING" | "PROCESSING" | "DONE" | "ERROR"
   * result: preenchido apenas quando status === "DONE"
   */
  getStatus: async (jobId: string): Promise<StatementJobStatus> => {
    const response = await api.get(`/statement/status/${jobId}`);
    return response.data;
  },
};
