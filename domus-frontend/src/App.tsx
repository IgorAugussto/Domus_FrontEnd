import { DashboardPage } from './components/DashboardPage';
import { ExpensesPage } from './components/ExpensesPage';
import { IncomePage } from './components/IncomePage';
import { InvestmentsPage } from './components/InvestmentsPage';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';

function App() {

  return (
    <div>
      <Navigation currentPage="dashboard" onPageChange={() => {}} onLogout={() => {}} />
      <main>
        <LoginPage onLogin={() => {}} />
        <DashboardPage /> 
        <ExpensesPage />
        <IncomePage />
        <InvestmentsPage />
      </main> 
    </div>
  )
}

export default App
