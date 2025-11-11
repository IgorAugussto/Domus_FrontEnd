import { useState } from 'react';
import { DashboardPage } from './components/DashboardPage';
import { ExpensesPage } from './components/ExpensesPage';
import { IncomePage } from './components/IncomePage';
import { InvestmentsPage } from './components/InvestmentsPage';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'income' | 'expenses' | 'investments'>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="max-w-6xl mx-auto p-6">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'income' && <IncomePage />}
        {currentPage === 'expenses' && <ExpensesPage />}
        {currentPage === 'investments' && <InvestmentsPage />}
      </main>
    </div>
  );
}

export default App
