// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { DashboardPage } from "./components/DashboardPage";
import ExpensesPage from "./components/ExpensesPage";
import IncomePage from "./components/IncomePage";
import InvestmentsPage from "./components/InvestmentsPage";
import LoginPage from "./components/LoginPage";
import PrivateLayout from "./layouts/PrivateLayout";
import RegisterPage from "./components/RegisterPage";



// === APP PRINCIPAL ===
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ROTAS PROTEGIDAS COM NAVEGAÇÃO */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/investments" element={<InvestmentsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
