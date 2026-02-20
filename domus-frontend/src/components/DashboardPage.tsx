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
  ReferenceLine,
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
import { useState, useEffect, useMemo } from "react";
import type { MonthlyProjection } from "../service/dashboardService";
import type { YearlyProjection } from "../service/dashboardService";
import { investmentTypeLabels } from "../utils/labels/investmentTypeLabels";
import { expenseCategoryLabels } from "../utils/labels/expenseCategoryLabels";
import { SpendingGoalModal } from "./SpendingGoalModal";
import { Button } from "../ui-components/button";

export function DashboardPage() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyProjection[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyProjection[]>([]);
  const [activeTab, setActiveTab] = useState<"ANUAL" | "MENSAL">("ANUAL");
  
  // ✅ CORRIGIDO: Sempre inicia com o mês atual
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return dayjs().format("YYYY-MM");
  });
  
  // ✅ NOVO: Controle de ano
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return dayjs().year();
  });
  
  const [kpiIncome, setKpiIncome] = useState(0);
  const [kpiExpenses, setKpiExpenses] = useState(0);
  const [kpiInvestments, setKpiInvestments] = useState(0);
  const [kpiNetWorth, setKpiNetWorth] = useState(0);
  const [kpiSavingsRate, setKpiSavingsRate] = useState<number>(0);

  // Estados para a meta de gastos
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [spendingGoal, setSpendingGoal] = useState<number>(0);
  const [showGoalLine, setShowGoalLine] = useState(false);

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

  // ✅ CORRIGIDO: useEffect principal com selectedYear como dependência
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
          dashboardService.getMonthlyProjection(),
          dashboardService.getYearlyProjection(selectedYear), // ✅ PASSA O ANO
        ]);

        setCosts(costData);
        setIncomes(incomeData);
        setInvestments(investmentData);

        setMonthlyData(monthlyProjectionData);
        setYearlyData(yearlyProjectionData);

        await loadMonthlySummary(selectedMonth);

        // Carregar meta salva do localStorage
        const savedGoal = localStorage.getItem("spendingGoal");
        if (savedGoal) {
          setSpendingGoal(Number(savedGoal));
          setShowGoalLine(true);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedYear, selectedMonth]); // ✅ CORRIGIDO: Adicionou dependências

  // ✅ NOVO: Garante que o mês atual seja selecionado após reload
  useEffect(() => {
    const currentMonth = dayjs().format("YYYY-MM");
    setSelectedMonth(currentMonth);
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

  const handleMonthClick = (month: string) => {
    if (activeTab !== "ANUAL") return;
    setSelectedMonth(month);
  };

  // Funções para gerenciar a meta de gastos
  const handleSaveGoal = (goal: number) => {
    setSpendingGoal(goal);
    setShowGoalLine(true);
    setShowGoalModal(false);
    localStorage.setItem("spendingGoal", goal.toString());
  };

  const handleToggleGoal = () => {
    if (showGoalLine) {
      setShowGoalLine(false);
    } else {
      setShowGoalModal(true);
    }
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

  const categoryTotals: Record<string, number> = {};
  costs.forEach((c) => {
    if (!c.category) return;
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
        color: palette[safeI % palette.length],
      };
    },
  );

  const investmentTypes: Record<string, number> = {};
  investments.forEach((i) => {
    if (!i.typeInvestments) return;

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
      const safeIndex = index >= 0 ? index : 0;

      return {
        name,
        value: Number(percentage),
        color: colors[safeIndex % colors.length],
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
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleMonthClick(payload.value)}
      >
        <rect
          width={width}
          height={height}
          rx={rx}
          ry={rx}
          fill={isActive ? "var(--financial-trust)" : "var(--card)"}
          stroke={isActive ? "var(--financial-trust)" : "var(--border)"}
          strokeWidth={1}
        />

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
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: "var(--card-foreground)" }}>
                {activeTab === "ANUAL"
                  ? "Visão Financeira Anual"
                  : "Visão Financeira Mensal"}
              </CardTitle>

              <Button
                onClick={handleToggleGoal}
                className="cursor-pointer"
                variant={showGoalLine ? "default" : "outline"}
                size="sm"
                style={
                  showGoalLine
                    ? {
                        background: "#06b6d4",
                        color: "white",
                      }
                    : {}
                }
              >
                <Target className="h-4 w-4 mr-2" />
                {showGoalLine ? "Meta Ativa" : "Definir Meta"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                tabIndex={-1}
                onMouseDown={(state: any) => {
                  state?.event?.preventDefault();
                }}
                onClick={(state: any) => {
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

                {/* Linha de meta de gastos */}
                {showGoalLine && spendingGoal > 0 && (
                  <ReferenceLine
                    y={spendingGoal}
                    stroke="#06b6d4"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Meta: ${spendingGoal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}`,
                      position: "insideTopRight",
                      fill: "#06b6d4",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.6}
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.6}
                />

                <Area
                  type="monotone"
                  dataKey="investments"
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
            className="card"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--card-foreground)" }}>
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart
                  tabIndex={-1}
                  onMouseDown={(state: any) => {
                    state?.event?.preventDefault();
                  }}
                >
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    isAnimationActive={false}
                    focusable={false}
                    label={(entry) => {
                      const name =
                        typeof entry.name === "string" ? entry.name : "";

                      const translatedName =
                        expenseCategoryLabels[name] ?? name;

                      return `${translatedName}: $${entry.value.toFixed(2)}`;
                    }}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
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
              <PieChart
                tabIndex={-1}
                onMouseDown={(state: any) => {
                  state?.event?.preventDefault();
                }}
              >
                <Pie
                  data={investmentPortfolio}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  isAnimationActive={false}
                  focusable={false}
                  label={(entry) => {
                    const name =
                      typeof entry.name === "string" ? entry.name : "";

                    const translatedName = investmentTypeLabels[name] ?? name;

                    return `${translatedName}: $${entry.value.toFixed(2)}`;
                  }}
                >
                  {investmentPortfolio.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
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

      {/* Modal de meta de gastos */}
      <SpendingGoalModal
        open={showGoalModal}
        currentGoal={spendingGoal}
        onSave={handleSaveGoal}
        onCancel={() => setShowGoalModal(false)}
      />
    </div>
  );
}