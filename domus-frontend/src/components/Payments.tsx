// =====================================================================
// Payments.tsx — Aba "Pagamentos"
// =====================================================================

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
import { FeedbackToast } from "../components/FeedbackToast";
import { costService } from "../service/costService";
import type { Cost } from "../service/costService";

export type PaymentType = "Cartão de Crédito" | "Boleto";

const frequencyLabels: Record<string, string> = {
  "One-time": "Único",
  Monthly: "Mensal",
};

const MONTH_NAMES: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março",
  "04": "Abril",   "05": "Maio",      "06": "Junho",
  "07": "Julho",   "08": "Agosto",    "09": "Setembro",
  "10": "Outubro", "11": "Novembro",  "12": "Dezembro",
};

const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconBoleto = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="7" y2="16" />
    <line x1="10" y1="8" x2="10" y2="16" />
    <line x1="13" y1="8" x2="13" y2="16" />
    <line x1="17" y1="8" x2="17" y2="16" />
  </svg>
);

const PAYMENT_CONFIG: Record<PaymentType, {
  label: string;
  icon: React.ReactNode;
  accentVar: string;
  bgClass: string;
  borderClass: string;
  payAllBg: string;
  payAllHover: string;
}> = {
  "Cartão de Crédito": {
    label: "Cartão de Crédito",
    icon: <IconCard />,
    accentVar: "var(--financial-danger)",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-400/40",
    payAllBg: "rgba(239,68,68,0.12)",
    payAllHover: "rgba(239,68,68,0.25)",
  },
  Boleto: {
    label: "Boleto",
    icon: <IconBoleto />,
    accentVar: "var(--financial-investment, #f59e0b)",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-400/40",
    payAllBg: "rgba(245,158,11,0.12)",
    payAllHover: "rgba(245,158,11,0.25)",
  },
};

function formatDate(iso: string): string {
  try {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
}

// ── Extrai "YYYY-MM" de uma data ISO ────────────────────────────────
function getYearMonth(iso: string): string {
  try {
    return iso.slice(0, 7); // "2026-04"
  } catch {
    return "";
  }
}

// ── Linha de despesa ─────────────────────────────────────────────────

function ExpenseRow({
  expense,
  onTogglePaid,
}: {
  expense: Cost;
  onTogglePaid: (id: string, paid: boolean) => void;
}) {
  const config = PAYMENT_CONFIG[expense.paymentType as PaymentType];
  const displayName =
    expense.description?.trim() !== "" ? expense.description : expense.category;

  return (
    <li
      className="p-3 rounded-lg border flex justify-between items-center gap-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        opacity: expense.paid ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="font-medium truncate"
          style={{
            textDecoration: expense.paid ? "line-through" : "none",
            color: "var(--card-foreground)",
          }}
        >
          {displayName}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {frequencyLabels[expense.frequency] ?? expense.frequency}
          {expense.startDate ? ` · Vence ${formatDate(expense.startDate)}` : ""}
          {" · "}
          <span
            className="font-medium"
            style={{
              color: expense.paymentType === "Cartão de Crédito"
                ? "var(--financial-danger)"
                : "var(--financial-investment, #f59e0b)",
            }}
          >
            {expense.paymentType}
          </span>
        </span>
      </div>

      <strong
        className="shrink-0 text-sm"
        style={{ color: expense.paid ? "var(--muted-foreground)" : config.accentVar }}
      >
        R$ {Number(expense.value).toFixed(2)}
      </strong>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
            expense.paid
              ? "border-green-400/40 bg-green-500/10"
              : `${config.borderClass} ${config.bgClass}`
          }`}
          style={{ color: expense.paid ? "var(--financial-success)" : config.accentVar }}
        >
          {expense.paid ? "Pago" : "Pendente"}
        </span>

        <button
          type="button"
          title={expense.paid ? "Marcar como pendente" : "Marcar como pago"}
          onClick={() => onTogglePaid(expense.id, !expense.paid)}
          className="cursor-pointer transition-opacity hover:opacity-70"
        >
          {expense.paid ? "↩️" : "✅"}
        </button>
      </div>
    </li>
  );
}

// ── Seção agrupada por tipo ──────────────────────────────────────────

function PaymentSection({
  paymentType,
  expenses,
  onTogglePaid,
  onPayAll,
}: {
  paymentType: PaymentType;
  expenses: Cost[];
  onTogglePaid: (id: string, paid: boolean) => void;
  onPayAll: (paymentType: PaymentType) => void;
}) {
  const config = PAYMENT_CONFIG[paymentType];
  const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);
  const pendingTotal = expenses.filter((e) => !e.paid).reduce((acc, e) => acc + Number(e.value), 0);
  const paidCount = expenses.filter((e) => e.paid).length;
  const allPaid = paidCount === expenses.length;
  const [hoveringPayAll, setHoveringPayAll] = useState(false);

  return (
    <Card className="border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span
              className={`p-1.5 rounded-lg ${config.bgClass} border ${config.borderClass}`}
              style={{ color: config.accentVar }}
            >
              {config.icon}
            </span>
            <span style={{ color: "var(--card-foreground)" }}>{config.label}</span>
          </CardTitle>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {paidCount}/{expenses.length} pago{paidCount !== 1 ? "s" : ""}
            </span>
            <div className="text-right text-sm">
              <div className="font-semibold" style={{ color: config.accentVar }}>
                Total: R$ {total.toFixed(2)}
              </div>
              {pendingTotal > 0 && (
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Pendente: R$ {pendingTotal.toFixed(2)}
                </div>
              )}
            </div>
            {!allPaid && (
              <button
                type="button"
                onClick={() => onPayAll(paymentType)}
                onMouseEnter={() => setHoveringPayAll(true)}
                onMouseLeave={() => setHoveringPayAll(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer"
                style={{
                  borderColor: config.accentVar,
                  color: config.accentVar,
                  background: hoveringPayAll ? config.payAllHover : config.payAllBg,
                }}
              >
                Pagar todos {config.label}
              </button>
            )}
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${expenses.length > 0 ? (paidCount / expenses.length) * 100 : 0}%`,
              background: "var(--financial-success)",
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center py-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Nenhuma despesa encontrada para este tipo de pagamento.
          </p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onTogglePaid={onTogglePaid} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ── Visão mensal: seção de um mês ────────────────────────────────────

function MonthSection({
  yearMonth,
  expenses,
  onTogglePaid,
}: {
  yearMonth: string;                          // "2026-04"
  expenses: Cost[];
  onTogglePaid: (id: string, paid: boolean) => void;
}) {
  const [year, month] = yearMonth.split("-");
  const monthName = MONTH_NAMES[month] ?? month;
  const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);
  const pendingTotal = expenses.filter((e) => !e.paid).reduce((acc, e) => acc + Number(e.value), 0);
  const paidCount = expenses.filter((e) => e.paid).length;

  // Destaca o mês atual
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const isCurrentMonth = yearMonth === currentYearMonth;

  return (
    <div className="space-y-2">
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: isCurrentMonth ? "var(--financial-trust)" : "var(--border)" }}
          />
          <h3
            className="font-semibold text-sm"
            style={{ color: isCurrentMonth ? "var(--financial-trust)" : "var(--card-foreground)" }}
          >
            {monthName} {year}
            {isCurrentMonth && (
              <span
                className="ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  color: "var(--financial-trust)",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                mês atual
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>{paidCount}/{expenses.length} pago{paidCount !== 1 ? "s" : ""}</span>
          <span style={{ color: "var(--financial-danger)" }}>
            Pendente: R$ {pendingTotal.toFixed(2)}
          </span>
          <span style={{ color: "var(--financial-success)" }}>
            Total: R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Barra de progresso do mês */}
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${expenses.length > 0 ? (paidCount / expenses.length) * 100 : 0}%`,
            background: "var(--financial-success)",
          }}
        />
      </div>

      {/* Lista de despesas do mês */}
      <ul className="space-y-2 pl-4">
        {expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} onTogglePaid={onTogglePaid} />
        ))}
      </ul>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────

export function Payments() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"TIPO" | "MES">("TIPO");
  const [hoveredView, setHoveredView] = useState<string | null>(null);

  useEffect(() => {
    costService
      .getAll()
      .then((data: Cost[]) => setCosts(data))
      .catch(() => setToast({ message: "Erro ao carregar despesas.", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTogglePaid = async (id: string, paid: boolean) => {
    const expense = costs.find((c) => c.id === id);
    if (!expense) return;
    try {
      await costService.update(Number(id), { ...expense, paid });
      setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, paid } : c)));
      setToast({
        message: paid ? "Despesa marcada como paga!" : "Despesa marcada como pendente.",
        type: "success",
      });
    } catch {
      setToast({ message: "Erro ao atualizar despesa.", type: "error" });
    }
  };

  const handlePayAll = async (paymentType: PaymentType) => {
    const pending = costs.filter((c) => c.paymentType === paymentType && !c.paid);
    if (pending.length === 0) return;
    try {
      await Promise.all(
        pending.map((expense) =>
          costService.update(Number(expense.id), { ...expense, paid: true })
        )
      );
      setCosts((prev) =>
        prev.map((c) => c.paymentType === paymentType && !c.paid ? { ...c, paid: true } : c)
      );
      setToast({
        message: `Todos os pagamentos de ${paymentType} marcados como pagos!`,
        type: "success",
      });
    } catch {
      setToast({ message: "Erro ao atualizar pagamentos.", type: "error" });
    }
  };

  const paymentExpenses = useMemo(
    () => costs.filter((c) => c.paymentType === "Cartão de Crédito" || c.paymentType === "Boleto"),
    [costs]
  );

  const filtered = useMemo(() => {
    if (filterStatus === "PENDING") return paymentExpenses.filter((e) => !e.paid);
    if (filterStatus === "PAID") return paymentExpenses.filter((e) => e.paid);
    return paymentExpenses;
  }, [paymentExpenses, filterStatus]);

  // Agrupado por tipo (visão padrão)
  const grouped = useMemo(() => {
    const result: Record<PaymentType, Cost[]> = { "Cartão de Crédito": [], Boleto: [] };
    filtered.forEach((e) => {
      if (e.paymentType === "Cartão de Crédito" || e.paymentType === "Boleto") {
        result[e.paymentType as PaymentType].push(e);
      }
    });
    return result;
  }, [filtered]);

  // Agrupado por mês (visão mensal) — ordenado cronologicamente
  const groupedByMonth = useMemo(() => {
    const map: Record<string, Cost[]> = {};
    filtered.forEach((e) => {
      if (!e.startDate) return;
      const ym = getYearMonth(e.startDate);
      if (!map[ym]) map[ym] = [];
      map[ym].push(e);
    });
    // Ordena os meses cronologicamente
    const sorted = Object.keys(map).sort();
    return sorted.map((ym) => ({ yearMonth: ym, expenses: map[ym] }));
  }, [filtered]);

  const grandTotal = paymentExpenses.reduce((acc, e) => acc + Number(e.value), 0);
  const pendingTotal = paymentExpenses.filter((e) => !e.paid).reduce((acc, e) => acc + Number(e.value), 0);
  const paidTotal = grandTotal - pendingTotal;
  const typesWithItems = (Object.keys(grouped) as PaymentType[]).filter((t) => grouped[t].length > 0);

  const filterOptions: {
    key: "ALL" | "PENDING" | "PAID";
    label: string;
    activeColor: string;
    activeBg: string;
    hoverColor: string;
  }[] = [
    { key: "ALL",     label: "Todos",     activeColor: "var(--financial-trust)",   activeBg: "rgba(59,130,246,0.18)",  hoverColor: "var(--financial-trust)"   },
    { key: "PENDING", label: "Pendentes", activeColor: "var(--financial-danger)",  activeBg: "rgba(239,68,68,0.18)",   hoverColor: "var(--financial-danger)"  },
    { key: "PAID",    label: "Pagos",     activeColor: "var(--financial-success)", activeBg: "rgba(16,185,129,0.18)",  hoverColor: "var(--financial-success)" },
  ];

  const viewOptions: { key: "TIPO" | "MES"; label: string }[] = [
    { key: "TIPO", label: "Por Tipo" },
    { key: "MES",  label: "Por Mês"  },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p style={{ color: "var(--muted-foreground)" }}>Carregando pagamentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-1">

      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: "var(--financial-trust)" }}
          >
            💳 Pagamentos
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Acompanhe o que ainda precisa ser pago
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Alternador de visão: Por Tipo / Por Mês */}
          <div
            className="flex gap-1 p-1 rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {viewOptions.map((opt) => {
              const isActive = viewMode === opt.key;
              const isHovered = hoveredView === opt.key && !isActive;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setViewMode(opt.key)}
                  onMouseEnter={() => setHoveredView(opt.key)}
                  onMouseLeave={() => setHoveredView(null)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.18)" : isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                    color: isActive || isHovered ? "var(--financial-trust)" : "var(--muted-foreground)",
                    border: isActive ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Filtro de status */}
          <div
            className="flex gap-1 p-1 rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {filterOptions.map((opt) => {
              const isActive = filterStatus === opt.key;
              const isHovered = hoveredFilter === opt.key && !isActive;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFilterStatus(opt.key)}
                  onMouseEnter={() => setHoveredFilter(opt.key)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    background: isActive ? opt.activeBg : isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                    color: isActive || isHovered ? opt.activeColor : "var(--muted-foreground)",
                    border: isActive ? `1px solid ${opt.activeColor}50` : "1px solid transparent",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── Cards de resumo ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Geral", value: grandTotal,    colorVar: "var(--card-foreground)",  emoji: "📊", borderColor: "var(--border)"             },
          { label: "Pendente",    value: pendingTotal,  colorVar: "var(--financial-danger)",  emoji: "⏳", borderColor: "rgba(239,68,68,0.3)"        },
          { label: "Pago",        value: paidTotal,     colorVar: "var(--financial-success)", emoji: "✅", borderColor: "rgba(16,185,129,0.3)"       },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: item.borderColor, background: "var(--card)" }}
          >
            <div className="text-xl">{item.emoji}</div>
            <div className="font-bold text-sm mt-1" style={{ color: item.colorVar }}>
              R$ {item.value.toFixed(2)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Conteúdo principal ── */}
      {paymentExpenses.length === 0 ? (
        <Card className="border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <CardContent className="py-10 text-center">
            <p className="text-4xl mb-3">💳</p>
            <p style={{ color: "var(--muted-foreground)" }}>
              Nenhuma despesa com Cartão de Crédito ou Boleto cadastrada ainda.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              Cadastre despesas na aba{" "}
              <strong style={{ color: "var(--card-foreground)" }}>Despesas</strong> e
              selecione o tipo de pagamento.
            </p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <CardContent className="py-8 text-center">
            <p style={{ color: "var(--muted-foreground)" }}>
              Nenhuma despesa encontrada para o filtro selecionado.
            </p>
          </CardContent>
        </Card>

      ) : viewMode === "TIPO" ? (
        // ── Visão por tipo ──
        <div className="space-y-4">
          {(["Cartão de Crédito", "Boleto"] as PaymentType[]).map(
            (type) =>
              grouped[type].length > 0 && (
                <PaymentSection
                  key={type}
                  paymentType={type}
                  expenses={grouped[type]}
                  onTogglePaid={handleTogglePaid}
                  onPayAll={handlePayAll}
                />
              )
          )}
        </div>

      ) : (
        // ── Visão por mês ──
        <Card className="border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base" style={{ color: "var(--card-foreground)" }}>
              📅 Linha do Tempo por Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedByMonth.length === 0 ? (
              <p className="text-center py-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Nenhuma despesa encontrada.
              </p>
            ) : (
              <div className="space-y-6">
                {groupedByMonth.map(({ yearMonth, expenses }, index) => (
                  <div key={yearMonth}>
                    <MonthSection
                      yearMonth={yearMonth}
                      expenses={expenses}
                      onTogglePaid={handleTogglePaid}
                    />
                    {/* Divisor entre meses */}
                    {index < groupedByMonth.length - 1 && (
                      <div
                        className="mt-6 border-t"
                        style={{ borderColor: "var(--border)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {toast && (
        <FeedbackToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}