// src/components/Navigation.tsx
import { Button } from '../ui-components/button';
import { DollarSign, TrendingUp, LogOut, Wallet, BarChart3, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme'; // ← novo caminho

type Page = 'login' | 'dashboard' | 'income' | 'expenses' | 'investments';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

export default function Navigation({ currentPage, onPageChange, onLogout }: NavigationProps) {
  const { theme, toggleTheme } = useTheme(); // ← AGORA FUNCIONA!

  return (
  <nav 
    className="border-b-2 p-4 shadow-lg"
    style={{
      background: theme === 'light' 
        ? 'linear-gradient(to right, #1e40af, #16a34a)' 
        : 'linear-gradient(to right, #1e3a8a, #15803d)',
      borderColor: theme === 'light' ? '#1e293b' : '#334155',
    }}
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 
          className="font-bold text-xl"
          style={{ color: 'white' }}
        >
          Financial Control
        </h2>
        <div className="flex gap-2">
          {/* Botões de navegação */}
          <Button
            variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
            onClick={() => onPageChange('dashboard')}
            style={{
              backgroundColor: currentPage === 'dashboard' ? 'white' : 'transparent',
              color: currentPage === 'dashboard' ? '#2563eb' : 'white',
            }}
            className="flex items-center gap-2 hover:bg-white/20"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={currentPage === 'income' ? 'secondary' : 'ghost'}
            onClick={() => onPageChange('income')}
            style={{
              backgroundColor: currentPage === 'income' ? 'white' : 'transparent',
              color: currentPage === 'income' ? '#16a34a' : 'white',
            }}
            className="flex items-center gap-2 hover:bg-white/20"
          >
            <Wallet className="h-4 w-4" />
            Income
          </Button>

          <Button
            variant={currentPage === 'expenses' ? 'secondary' : 'ghost'}
            onClick={() => onPageChange('expenses')}
            style={{
              backgroundColor: currentPage === 'expenses' ? 'white' : 'transparent',
              color: currentPage === 'expenses' ? '#dc2626' : 'white',
            }}
            className="flex items-center gap-2 hover:bg-white/20"
          >
            <DollarSign className="h-4 w-4" />
            Expenses
          </Button>

          <Button
            variant={currentPage === 'investments' ? 'secondary' : 'ghost'}
            onClick={() => onPageChange('investments')}
            style={{
              backgroundColor: currentPage === 'investments' ? 'white' : 'transparent',
              color: currentPage === 'investments' ? '#f59e0b' : 'white',
            }}
            className="flex items-center gap-2 hover:bg-white/20"
          >
            <TrendingUp className="h-4 w-4" />
            Investments
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* BOTÃO DE TEMA */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          style={{ color: 'white' }}
          className="hover:bg-white/20"
          title={theme === 'light' ? 'Tema escuro' : 'Tema claro'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <Button 
          variant="ghost" 
          onClick={onLogout} 
          style={{ color: 'white' }}
          className="flex items-center gap-2 hover:bg-white/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  </nav>
);
}