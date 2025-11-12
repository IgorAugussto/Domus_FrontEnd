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
              variant={currentPage === 'dashboard' ? 'navActive' : 'ghost'}
              onClick={() => onPageChange('dashboard')}
              className={`
                flex items-center gap-2 transition-all 
                $${currentPage === 'dashboard' ? '' : 'hover:bg-white/20'}
              `}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>

          <Button
              variant={currentPage === 'income' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('income')}
              className={`
                flex items-center gap-2 rounded-lg transition-all
                ${currentPage === 'income' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-white hover:bg-white/20'
                }
              `}
            >
              <Wallet className="h-4 w-4" />
              Income
            </Button>

            {/* === EXPENSES === */}
            <Button
              variant={currentPage === 'expenses' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('expenses')}
              className={`
                flex items-center gap-2 rounded-lg transition-all
                ${currentPage === 'expenses' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-white hover:bg-white/20'
                }
              `}
            >
              <DollarSign className="h-4 w-4" />
              Expenses
            </Button>

            {/* === INVESTMENTS === */}
            <Button
              variant={currentPage === 'investments' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('investments')}
              className={`
                flex items-center gap-2 rounded-lg transition-all
                ${currentPage === 'investments' 
                  ? 'bg-white text-amber-600 shadow-sm' 
                  : 'text-white hover:bg-white/20'
                }
              `}
            >
              <TrendingUp className="h-4 w-4" />
              Investments
            </Button>
          </div>
        </div>

      <div className="flex items-center gap-2">
        {/* TEMA */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white hover:bg-white/20 rounded-lg"
            title={theme === 'light' ? 'Tema escuro' : 'Tema claro'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* LOGOUT */}
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