// src/types.ts
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export interface Expense extends Transaction {
  category: string;
}

export interface Income extends Transaction {
  source: string;
  frequency: string;
}

export interface Investment extends Transaction {
  type: string;
  expectedReturn: number;
}

export type Page = 'login' | 'dashboard' | 'income' | 'expenses' | 'investments';