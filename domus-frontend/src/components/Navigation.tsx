// src/components/Navigation.tsx
import { Button } from '../ui-components/button';
import { DollarSign, TrendingUp, LogOut, Wallet, BarChart3, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLocation } from "react-router-dom";

type Page = 'dashboard' | 'income' | 'expenses' | 'investments';

interface NavigationProps {
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

export default function Navigation({ onPageChange, onLogout }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // Detecta automaticamente a página atual
  const currentPage = pathname.replace("/", "") as Page;

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

          {/* Botões de navegação */}
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'navActiveDashboard' : 'navButton'}
              onClick={() => onPageChange('dashboard')}
              className="flex items-center gap-2 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={currentPage === 'income' ? 'navActiveIncome' : 'navButton'}
              onClick={() => onPageChange('income')}
              className="flex items-center gap-2 transition-all"
            >
              <Wallet className="h-4 w-4" />
              Income
            </Button>

            <Button
              variant={currentPage === 'expenses' ? 'navActiveExpenses' : 'navButton'}
              onClick={() => onPageChange('expenses')}
              className="flex items-center gap-2 transition-all"
            >
              <DollarSign className="h-4 w-4" />
              Expenses
            </Button>

            <Button
              variant={currentPage === 'investments' ? 'navActiveInvestments' : 'navButton'}
              onClick={() => onPageChange('investments')}
              className="flex items-center gap-2 transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Investments
            </Button>
          </div>
        </div>

        {/* Tema + Logout */}
        <div className="flex items-center gap-2">
          {/* Modo Claro/Escuro */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white hover:bg-white/20 rounded-lg"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={onLogout}
            className="flex items-center gap-2 text-white hover:bg-white/20 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
