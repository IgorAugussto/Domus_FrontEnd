// src/components/DashboardPage.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
import { Progress } from "../ui-components/progress";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react";
import { costService } from "../service/costService";
import { incomeService } from "../service/incomeService";
import { investmentService, type Investment } from "../service/investmentService";
import { useState, useEffect } from "react";

interface Cost {
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

/*interface Investment {
  id: string;
  amount: number;
  type: string;
  expectedReturn: number;
  date: string;
  description: string;
}*/

/*interface DashboardPageProps {
  expenses: Expense[];
  incomes: Income[];
  investments: Investment[];
}*/

export function DashboardPage() {
  // === ESTADOS (agora começam vazios) ===
  const [costs, setCosts] = useState<Cost[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true); // pra mostrar carregando se quiser

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Busca tudo ao mesmo tempo (rápido!)
        const [costData, incomeData, investmentData] = await Promise.all([
          costService.getAll(),
          incomeService.getAll(),
          investmentService.getAll(),
        ]);

        setCosts(costData);
        setIncomes(incomeData);
        setInvestments(investmentData);

        // === HISTÓRICO MENSAL 100% REAL (começa vazio e vai enchendo sozinho) ===
        const [monthlyData, setMonthlyData] = useState<
          Array<{
            month: string;
            income: number;
            expenses: number;
            investments: number;
          }>
        >([]);

        // ... dentro do useEffect (continua igual até aqui)

        // === CÁLCULO DO HISTÓRICO MENSAL REAL (agora com tipos corretos) ===
        const monthlyMap = new Map<
          string,
          { income: number; expenses: number; investments: number }
        >();

        const getMonthKey = (dateStr: string): string => {
          const date = new Date(dateStr);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          return `${year}-${month}`;
        };

        // Rendas
        incomeData.forEach((i: Income) => {
          const key = getMonthKey(i.date);
          const current = monthlyMap.get(key) || {
            income: 0,
            expenses: 0,
            investments: 0,
          };
          current.income += i.amount;
          monthlyMap.set(key, current);
        });

        // Despesas
        costData.forEach((e: Cost) => {
          const key = getMonthKey(e.date);
          const current = monthlyMap.get(key) || {
            income: 0,
            expenses: 0,
            investments: 0,
          };
          current.expenses += e.amount;
          monthlyMap.set(key, current);
        });

        // Investimentos
        investmentData.forEach((inv: Investment) => {
          const key = getMonthKey(inv.date);
          const current = monthlyMap.get(key) || {
            income: 0,
            expenses: 0,
            investments: 0,
          };
          current.investments += inv.amount;
          monthlyMap.set(key, current);
        });

        // Transforma em array ordenado
        const sortedData = Array.from(monthlyMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => {
            const [year, month] = key.split("-");
            const monthName = new Date(
              parseInt(year),
              parseInt(month) - 1
            ).toLocaleString("en-US", { month: "short" });
            return {
              month: monthName,
              income: Number(value.income.toFixed(2)),
              expenses: Number(value.expenses.toFixed(2)),
              investments: Number(value.investments.toFixed(2)),
            };
          });

        setMonthlyData(sortedData); // ← agora o TypeScript reconhece!
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // === SE AINDA TÁ CARREGANDO (opcional) ===
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Carregando seu dashboard financeiro...</p>
      </div>
    );
  }
  // === CÁLCULOS REAIS (usando props) ===
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalCost = costs.reduce((sum, e) => sum + e.amount, 0);
  const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
  const investmentGains = totalInvestments * 0.057; // 5.7%
  const netWorth =
    totalIncome - totalCost + totalInvestments + investmentGains;
  const netIncome = totalIncome - totalCost;
  const savingsRate =
    totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : "0";

  // === DADOS MENSAL (fixo + real no último mês) ===
  const monthlyData = [
    { month: "Jan", income: 4500, cost: 1200, investments: 1000 },
    { month: "Feb", income: 4500, cost: 1100, investments: 1500 },
    { month: "Mar", income: 4800, cost: 1300, investments: 800 },
    { month: "Apr", income: 4500, cost: 1050, investments: 1200 },
    { month: "May", income: 5200, cost: 1400, investments: 900 },
    {
      month: "Jun",
      income: totalIncome,
      cost: totalCost,
      investments: totalInvestments,
    },
  ];

  // === CATEGORIAS DE DESPESAS (gráfico de pizza) ===
  const categoryTotals: { [key: string]: number } = {};
  costs.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const expenseCategories = Object.entries(categoryTotals).map(
    ([name, value], i) => {
      const colors = [
        "var(--financial-danger)",
        "var(--financial-investment)",
        "var(--financial-trust)",
        "var(--financial-success)",
        "var(--financial-neutral)",
      ];
      return { name, value, color: colors[i % colors.length] };
    }
  );

  // === PORTFÓLIO DE INVESTIMENTOS (gráfico de pizza) ===
  const investmentTypes: { [key: string]: number } = {};
  investments.forEach((i) => {
    investmentTypes[i.type] = (investmentTypes[i.type] || 0) + i.amount;
  });

  const investmentPortfolio = Object.entries(investmentTypes).map(
    ([name, value]) => {
      const percentage = ((value / totalInvestments) * 100).toFixed(0);
      const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];
      return {
        name,
        value: parseInt(percentage),
        color:
          colors[Object.keys(investmentTypes).indexOf(name) % colors.length],
      };
    }
  );

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--financial-trust-light)" }}
        >
          <Target
            className="h-6 w-6"
            style={{ color: "var(--financial-trust)" }}
          />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--financial-trust)" }}
        >
          Financial Dashboard
        </h1>
      </div>

      {/* 4 CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL INCOME */}
        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-success-light), var(--card))`,
            borderColor: "var(--financial-success)",
            color: "var(--card-foreground)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-success)" }}
            >
              Total Income
            </CardTitle>
            <Wallet
              className="h-4 w-4"
              style={{ color: "var(--financial-success)" }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--financial-success)" }}
            >
              $
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-success)" }}
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {incomes.length} entries
            </p>
          </CardContent>
        </Card>

        {/* TOTAL EXPENSES */}
        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-danger-light), var(--card))`,
            borderColor: "var(--financial-danger)",
            color: "var(--card-foreground)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-danger)" }}
            >
              Total Expenses
            </CardTitle>
            <DollarSign
              className="h-4 w-4"
              style={{ color: "var(--financial-danger)" }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--financial-danger)" }}
            >
              $
              {totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-danger)" }}
            >
              <TrendingDown className="h-3 w-3 inline mr-1" />
              {costs.length} entries
            </p>
          </CardContent>
        </Card>

        {/* PORTFOLIO VALUE */}
        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-investment-light), var(--card))`,
            borderColor: "var(--financial-investment)",
            color: "var(--card-foreground)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-investment)" }}
            >
              Portfolio Value
            </CardTitle>
            <TrendingUp
              className="h-4 w-4"
              style={{ color: "var(--financial-investment)" }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--financial-investment)" }}
            >
              $
              {(totalInvestments + investmentGains).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-success)" }}
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5.7% returns
            </p>
          </CardContent>
        </Card>

        {/* NET WORTH */}
        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-trust-light), var(--card))`,
            borderColor: "var(--financial-trust)",
            color: "var(--card-foreground)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-trust)" }}
            >
              Net Worth
            </CardTitle>
            <Target
              className="h-4 w-4"
              style={{ color: "var(--financial-trust)" }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--financial-trust)" }}
            >
              ${netWorth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-trust)" }}
            >
              Savings Rate: {savingsRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TRENDS */}
        <Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--card-foreground)" }}>
              Monthly Financial Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="investments"
                  stackId="3"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* EXPENSE CATEGORIES */}
        {expenseCategories.length > 0 && (
          <Card
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--card-foreground)" }}>
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) =>
                      `${entry.name}: $${entry.value.toFixed(2)}`
                    }
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* SAVINGS + PORTFOLIO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--card-foreground)" }}>
              Savings Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div
                className="flex justify-between mb-2 text-sm"
                style={{ color: "var(--card-foreground)" }}
              >
                <span>Emergency Fund</span>
                <span>$8,000 / $10,000</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div
                className="flex justify-between mb-2 text-sm"
                style={{ color: "var(--card-foreground)" }}
              >
                <span>Vacation Fund</span>
                <span>$2,400 / $5,000</span>
              </div>
              <Progress value={48} className="h-2" />
            </div>
            <div>
              <div
                className="flex justify-between mb-2 text-sm"
                style={{ color: "var(--card-foreground)" }}
              >
                <span>Investment Goal</span>
                <span>${totalInvestments.toFixed(0)} / $15,000</span>
              </div>
              <Progress
                value={(totalInvestments / 15000) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--card-foreground)" }}>
              Investment Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={investmentPortfolio}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={3}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {investmentPortfolio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--card-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* INSIGHTS */}
      <Card
        style={{
          background: "var(--card)",
          borderColor:
            parseFloat(savingsRate) >= 20
              ? "var(--financial-success)"
              : "var(--financial-danger)",
        }}
      >
        <CardHeader
          style={{
            background:
              parseFloat(savingsRate) >= 20
                ? "var(--financial-success-light)"
                : "var(--financial-danger-light)",
          }}
        >
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--card-foreground)" }}
          >
            <AlertCircle className="h-5 w-5" />
            Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parseFloat(savingsRate) >= 20 ? (
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: "var(--financial-success-light)",
                border: `1px solid var(--financial-success)`,
                color: "var(--financial-success)",
              }}
            >
              <p>
                <strong>Great job!</strong> Your savings rate of {savingsRate}%
                is above the recommended 20%.
              </p>
            </div>
          ) : (
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: "var(--financial-danger-light)",
                border: `1px solid var(--financial-danger)`,
                color: "var(--financial-danger)",
              }}
            >
              <p>
                <strong>Attention:</strong> Your savings rate is {savingsRate}%.
                Try to reach at least 20%.
              </p>
            </div>
          )}
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: "var(--financial-trust-light)",
              border: `1px solid var(--financial-trust)`,
              color: "var(--financial-trust)",
            }}
          >
            <p>
              <strong>Investment Performance:</strong> Your portfolio has gained
              ${investmentGains.toFixed(2)} (+5.7%) this period.
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: "var(--financial-neutral)",
              border: `1px solid var(--border)`,
              color: "var(--card-foreground)",
            }}
          >
            <p>
              <strong>Recommendation:</strong> Consider increasing your
              emergency fund to reach the $10,000 goal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
