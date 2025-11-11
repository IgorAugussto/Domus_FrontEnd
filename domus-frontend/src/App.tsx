import { useState } from 'react';
import Navigation from './components/Navigation';
import  LoginPage  from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ExpensesPage from './components/ExpensesPage';
import IncomePage from './components/IncomePage';
import InvestmentsPage from './components/InvestmentsPage';
import type { Expense, Income, Investment, Page } from './types';


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

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

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div 
    className="min-h-screen"
    style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
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
      {currentPage === 'expenses' && (
        <ExpensesPage 
          expenses={expenses}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
        />
      )}
      {currentPage === 'income' && (
        <IncomePage 
          incomes={incomes}
          onAddIncome={addIncome}
          onDeleteIncome={deleteIncome}
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