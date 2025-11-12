// src/App.tsx
import { useState } from 'react';
import { DashboardPage } from './components/DashboardPage';
import ExpensesPage  from './components/ExpensesPage';
import IncomePage from './components/IncomePage';
import InvestmentsPage from './components/InvestmentsPage';
import LoginPage  from './components/LoginPage';
import Navigation from './components/Navigation';

// === TIPOS GLOBAIS ===
interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Income {
  id: string;
  amount: number;
  source: string;
  frequency: string;
  date: string;
  description: string;
}

interface Investment {
  id: string;
  amount: number;
  type: string;
  expectedReturn: number;
  date: string;
  description: string;
}

type Page = 'login' | 'dashboard' | 'income' | 'expenses' | 'investments';

// === APP PRINCIPAL ===
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // === FUNÇÕES DE AUTENTICAÇÃO ===
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // === FUNÇÕES DE DADOS ===
  const addExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const addIncome = (income: Income) => {
    setIncomes([income, ...incomes]);
  };

  const addInvestment = (investment: Investment) => {
    setInvestments([investment, ...investments]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter(i => i.id !== id));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  // === RENDERIZAÇÃO ===
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom right, var(--background), var(--card))'
      }}
    >
      <Navigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto p-6">
        {currentPage === 'dashboard' && (
          <DashboardPage 
            expenses={expenses}
            incomes={incomes}
            investments={investments}
          />
        )}
        {currentPage === 'income' && (
          <IncomePage 
            incomes={incomes}
            onAddIncome={addIncome}
            onDeleteIncome={deleteIncome}
          />
        )}
        {currentPage === 'expenses' && (
          <ExpensesPage 
            expenses={expenses}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        )}
        {currentPage === 'investments' && (
          <InvestmentsPage 
            investments={investments}
            onAddInvestment={addInvestment}
            onDeleteInvestment={deleteInvestment}
          />
        )}
      </main>
    </div>
  );
}