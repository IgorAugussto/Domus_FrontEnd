// src/components/DashboardPage.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
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
} from "lucide-react";
import dayjs from "dayjs";
import type { Cost } from "../service/costService";
import type { Income } from "../service/incomeService";
import type { Investment } from "../service/investmentService";
import { costService } from "../service/costService";
import { incomeService } from "../service/incomeService";
import { investmentService } from "../service/investmentService";
import { dashboardService } from "../service/dashboardService";
import { useState, useEffect } from "react";
import type { MonthlyProjection } from "../service/dashboardService";
import type { YearlyProjection } from "../service/dashboardService";
import { useMemo } from "react";
import { investmentTypeLabels } from "../utils/labels/investmentTypeLabels";
import { expenseCategoryLabels } from "../utils/labels/expenseCategoryLabels";

export function DashboardPage() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  //const [totalInvestments, /*setTotalInvestments*/] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyProjection[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyProjection[]>([]);
  const [activeTab, setActiveTab] = useState<"ANUAL" | "MENSAL">("ANUAL");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("YYYY-MM"),
  );
  const [kpiIncome, setKpiIncome] = useState(0);
  const [kpiExpenses, setKpiExpenses] = useState(0);
  const [kpiInvestments, setKpiInvestments] = useState(0);
  const [kpiNetWorth, setKpiNetWorth] = useState(0);
  const [kpiSavingsRate, setKpiSavingsRate] = useState<number>(0);
  const totalInvestments = useMemo(() => {
    return investments.reduce((acc, inv) => acc + Number(inv.value), 0);
  }, [investments]);

  const loadMonthlySummary = async (month: string) => {
    try {
      const data = await dashboardService.getMonthlySummary(month);

      setKpiIncome(Number(data.income));
      setKpiExpenses(Number(data.expenses));
      setKpiInvestments(Number(data.investments));
      setKpiNetWorth(Number(data.netWorth));
      setKpiSavingsRate(Number(data.savingsRate));
    } catch (err) {
      console.error("Erro ao carregar resumo mensal", err);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [
          costData,
          incomeData,
          investmentData,
          _totalIncomeValue,
          _totalCostValue,
          _totalInvestmentValue,
          _dashboardSummary,
          monthlyProjectionData,
          yearlyProjectionData,
        ] = await Promise.all([
          costService.getAll(),
          incomeService.getAll(),
          investmentService.getAll(),
          incomeService.getTotal(),
          costService.getTotal(),
          investmentService.getTotal(),
          dashboardService.getSummary(),
          dashboardService.getMonthlyProjection(), // TAB MENSAL
          dashboardService.getYearlyProjection(), // TAB ANUAL
        ]);

        /* ============================
         LISTAS BASE
      ============================ */
        setCosts(costData);
        setIncomes(incomeData);
        setInvestments(investmentData);

        /* ============================
         DADOS DOS GRÁFICOS
      ============================ */
        setMonthlyData(monthlyProjectionData);
        setYearlyData(yearlyProjectionData);

        /* ============================
         🔥 KPIs MENSAIS (NOVO)
      ============================ */
        await loadMonthlySummary(selectedMonth);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;

    const loadMonthlySummary = async () => {
      try {
        const data = await dashboardService.getMonthlySummary(selectedMonth);

        setKpiIncome(Number(data.income));
        setKpiExpenses(Number(data.expenses));
        setKpiInvestments(Number(data.investments));
        setKpiNetWorth(Number(data.netWorth));
        setKpiSavingsRate(Number(data.savingsRate));
      } catch (error) {
        console.error("Erro ao carregar resumo mensal:", error);
      }
    };

    loadMonthlySummary();
  }, [selectedMonth]);

  /* ============================
     CLIQUE NO GRÁFICO
  ============================ */

  const handleMonthClick = (month: string) => {
    if (activeTab !== "ANUAL") return;
    setSelectedMonth(month);
  };

  const expectedReturnAverage = useMemo(() => {
    if (totalInvestments === 0) return 0;

    const weightedReturn = investments.reduce((acc, inv) => {
      const value = Number(inv.value);
      const rate = Number(inv.expectedReturn) || 0;

      return acc + value * (rate / 100);
    }, 0);

    return (weightedReturn / totalInvestments) * 100;
  }, [investments, totalInvestments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Carregando seu dashboard financeiro...</p>
      </div>
    );
  }

  // Categorias de despesas
  const categoryTotals: Record<string, number> = {};
  costs.forEach((c) => {
    if (!c.category) return; // <-- Impede undefined

    categoryTotals[c.category] = (categoryTotals[c.category] || 0) + c.value;
  });

  const palette = [
    "var(--financial-danger)",
    "var(--financial-investment)",
    "var(--financial-trust)",
    "var(--financial-success)",
    "var(--financial-neutral)",
  ];

  const expenseCategories = Object.entries(categoryTotals).map(
    ([name, value], i) => {
      const safeI = Number.isFinite(i) ? i : 0;

      return {
        name,
        value,
        color: palette[safeI % palette.length], // 100% seguro
      };
    },
  );

  // Portfolio de investimentos
  const investmentTypes: Record<string, number> = {};
  investments.forEach((i) => {
    if (!i.typeInvestments) return; // <-- Impede undefined

    investmentTypes[i.typeInvestments] =
      (investmentTypes[i.typeInvestments] || 0) + i.value;
  });

  const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

  const investmentPortfolio = Object.entries(investmentTypes).map(
    ([name, value]) => {
      const percentage =
        totalInvestments > 0
          ? ((value / totalInvestments) * 100).toFixed(0)
          : "0";

      const index = Object.keys(investmentTypes).indexOf(name);

      // Garante que nunca será undefined
      const safeIndex = index >= 0 ? index : 0;

      return {
        name,
        value: Number(percentage),
        color: colors[safeIndex % colors.length], // ← CORRIGIDO
      };
    },
  );

  const chartData = activeTab === "ANUAL" ? yearlyData : monthlyData;

  const ClickableMonthTick = ({ x, y, payload }: any) => {
    const isActive = payload.value === selectedMonth;

    const width = 64;
    const height = 26;
    const rx = 8;

    return (
      <g
        transform={`translate(${x - width / 2}, ${y})`}
        style={{ cursor: "pointer" }}
        onClick={() => handleMonthClick(payload.value)}
      >
        {/* Fundo do "botão" */}
        <rect
          width={width}
          height={height}
          rx={rx}
          ry={rx}
          fill={isActive ? "var(--financial-trust)" : "var(--card)"}
          stroke={isActive ? "var(--financial-trust)" : "var(--border)"}
          strokeWidth={1}
        />

        {/* Texto */}
        <text
          x={width / 2}
          y={height / 2 + 4}
          textAnchor="middle"
          fill={isActive ? "#fff" : "var(--muted-foreground)"}
          fontSize={12}
          fontWeight={isActive ? "600" : "400"}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
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
          Dashboard Financeiro
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-success-light), var(--card))`,
            borderColor: "var(--financial-success)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-success)" }}
            >
              Renda Total
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
              {kpiIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-success)" }}
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {incomes.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-danger-light), var(--card))`,
            borderColor: "var(--financial-danger)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-danger)" }}
            >
              Despesas Totais
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
              {kpiExpenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-danger)" }}
            >
              <TrendingDown className="h-3 w-3 inline mr-1" />
              {costs.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-investment-light), var(--card))`,
            borderColor: "var(--financial-investment)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-investment)" }}
            >
              Carteira de Investimentos
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
              {kpiInvestments.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-success)" }}
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />+
              {expectedReturnAverage.toFixed(2)}% Retorno esperado
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: `linear-gradient(to bottom, var(--financial-trust-light), var(--card))`,
            borderColor: "var(--financial-trust)",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm"
              style={{ color: "var(--financial-trust)" }}
            >
              Patrimônio Líquido
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
              {kpiNetWorth.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--financial-trust)" }}
            >
              Quanto Você Economizou: {kpiSavingsRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${
            activeTab === "ANUAL" ? "active" : "tab"
          }`}
          onClick={() => setActiveTab("ANUAL")}
        >
          Anual
        </button>

        <button
          className={`dashboard-tab ${
            activeTab === "MENSAL" ? "active" : "tab"
          }`}
          onClick={() => setActiveTab("MENSAL")}
        >
          Mensal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--card-foreground)" }}>
              {activeTab === "ANUAL"
                ? "Visão Financeira Anual"
                : "Visão Financeira Mensal"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                onClick={(state: any) => {
                  // 🔒 Só permite clique no modo ANUAL
                  if (activeTab !== "ANUAL") return;

                  const payload = state?.activePayload?.[0]?.payload;
                  if (!payload?.month) return;

                  setSelectedMonth(payload.month);
                  loadMonthlySummary(payload.month);
                }}
              >
                <CartesianGrid stroke="var(--border)" />

                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  tick={<ClickableMonthTick />}
                />

                <YAxis stroke="var(--muted-foreground)" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--card-foreground)",
                  }}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    name,
                  ]}
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

            {monthlyData.length === 0 && (
              <div className="text-center mt-10 text-muted-foreground">
                <p className="text-lg font-medium">Ainda não há histórico</p>
                <p className="text-sm">
                  Cadastre rendas e despesas para ver o gráfico crescer
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expenseCategories.length > 0 && (
          <Card
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--card-foreground)" }}>
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={(entry) => {
                      const name =
                        typeof entry.name === "string" ? entry.name : "";

                      const translatedName =
                        expenseCategoryLabels[name] ?? name;

                      return `${translatedName}: $${entry.value.toFixed(2)}`;
                    }}
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

        {/*<Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
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
        </Card>*/}

        <Card
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--card-foreground)" }}>
              Alocação de Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={investmentPortfolio}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={(entry) => {
                    const name =
                      typeof entry.name === "string" ? entry.name : "";

                    const translatedName = investmentTypeLabels[name] ?? name;

                    return `${translatedName}: $${entry.value.toFixed(2)}`;
                  }}
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

      {/*<Card
        style={{
          background: "var(--card)",
          borderColor:
            parseFloat(savingsRate) >= 20
              ? "var(--financial-success)"
              : "var(--financial-danger)",
        }}>
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
      </Card>*/}
    </div>
  );
}
