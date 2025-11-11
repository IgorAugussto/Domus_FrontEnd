import { Button } from '../ui-components/button';
import { DollarSign, TrendingUp, LogOut, Wallet, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: 'dashboard' | 'income' | 'expenses' | 'investments';
  onPageChange: (page: 'dashboard' | 'income' | 'expenses' | 'investments') => void;
  onLogout: () => void;
}

export function Navigation({ currentPage, onPageChange, onLogout }: NavigationProps) {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-600 border-b-2 border-blue-700 p-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold">Financial Control</h2>
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('dashboard')}
              className={`flex items-center gap-2 ${
                currentPage === 'dashboard' 
                  ? 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'income' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('income')}
              className={`flex items-center gap-2 ${
                currentPage === 'income' 
                  ? 'bg-white text-green-600 hover:bg-green-50 border-green-200' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Income
            </Button>
            <Button
              variant={currentPage === 'expenses' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('expenses')}
              className={`flex items-center gap-2 ${
                currentPage === 'expenses' 
                  ? 'bg-white text-red-600 hover:bg-red-50 border-red-200' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              Expenses
            </Button>
            <Button
              variant={currentPage === 'investments' ? 'secondary' : 'ghost'}
              onClick={() => onPageChange('investments')}
              className={`flex items-center gap-2 ${
                currentPage === 'investments' 
                  ? 'bg-white text-amber-600 hover:bg-amber-50 border-amber-200' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Investments
            </Button>
          </div>
        </div>
        <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2 text-white hover:bg-white/20">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}