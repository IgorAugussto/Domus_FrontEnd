// =====================================================================
// Payments.tsx — Aba "Pagamentos"
// Segue o mesmo padrão visual e de componentes do projeto existente.
// =====================================================================

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui-components/card";
import { Button } from "../ui-components/button";
import { FeedbackToast } from "../components/FeedbackToast";
import { costService } from "../service/costService"; // ajuste o caminho conforme seu projeto
import type { Cost } from "../service/costService";

// ── Tipos ────────────────────────────────────────────────────────────

export type PaymentType = "Cartão de Crédito" | "Boleto";

// ── Labels ───────────────────────────────────────────────────────────

const frequencyLabels: Record<string, string> = {
  "One-time": "Único",
  Monthly: "Mensal",
};

// ── Ícones inline (sem dependência extra) ────────────────────────────

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

// ── Configuração por tipo de pagamento ───────────────────────────────

const PAYMENT_CONFIG: Record<PaymentType, {
  label: string;
  icon: React.ReactNode;
  accentVar: string;
  bgClass: string;
  borderClass: string;
}> = {
  "Cartão de Crédito": {
    label: "Cartão de Crédito",
    icon: <IconCard />,
    accentVar: "var(--financial-danger)",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-400/40",
  },
  Boleto: {
    label: "Boleto",
    icon: <IconBoleto />,
    accentVar: "var(--financial-warning, #f59e0b)",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-400/40",
  },
};

// ── Utilitário de data ───────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
}

// ── Componente de linha de despesa ───────────────────────────────────

function ExpenseRow({
  expense,
  onTogglePaid,
}: {
  expense: Cost;
  onTogglePaid: (id: string, paid: boolean) => void;
}) {
  const config = PAYMENT_CONFIG[expense.paymentType as PaymentType];
  const displayName =
    expense.description?.trim() !== ""
      ? expense.description
      : expense.category;

  return (
    <li
      className="p-3 rounded-lg border flex justify-between items-center gap-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        opacity: expense.paid ? 0.65 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Esquerda: info da despesa */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="font-medium truncate"
          style={{
            textDecoration: expense.paid ? "line-through" : "none",
            color: "var(--foreground)",
          }}
        >
          {displayName}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {frequencyLabels[expense.frequency] ?? expense.frequency}
          {expense.startDate ? ` · Vence ${formatDate(expense.startDate)}` : ""}
        </span>
      </div>

      {/* Centro: valor */}
      <strong
        className="shrink-0 text-sm"
        style={{
          color: expense.paid
            ? "var(--muted-foreground)"
            : config.accentVar,
        }}
      >
        R$ {Number(expense.value).toFixed(2)}
      </strong>

      {/* Direita: badge de status + botão toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
            expense.paid
              ? "border-green-400/40 text-green-400 bg-green-500/10"
              : `${config.borderClass} ${config.bgClass}`
          }`}
          style={{
            color: expense.paid ? undefined : config.accentVar,
          }}
        >
          {expense.paid ? "Pago" : "Pendente"}
        </span>

        <Button
          type="button"
          title={expense.paid ? "Marcar como pendente" : "Marcar como pago"}
          onClick={() => onTogglePaid(expense.id, !expense.paid)}
          className="hover:opacity-70 cursor-pointer transition-opacity"
          style={{
            color: expense.paid ? "var(--muted-foreground)" : "var(--foreground)",
          }}
        >
          {expense.paid ? "↩️" : "✅"}
        </Button>
      </div>
    </li>
  );
}

// ── Seção agrupada por tipo ──────────────────────────────────────────

function PaymentSection({
  paymentType,
  expenses,
  onTogglePaid,
}: {
  paymentType: PaymentType;
  expenses: Cost[];
  onTogglePaid: (id: string, paid: boolean) => void;
}) {
  const config = PAYMENT_CONFIG[paymentType];
  const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);
  const pendingTotal = expenses
    .filter((e) => !e.paid)
    .reduce((acc, e) => acc + Number(e.value), 0);
  const paidCount = expenses.filter((e) => e.paid).length;

  return (
    <Card
      className="border"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Header da seção */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span
              className={`p-1.5 rounded-lg ${config.bgClass} border ${config.borderClass}`}
              style={{ color: config.accentVar }}
            >
              {config.icon}
            </span>
            <span style={{ color: "var(--foreground)" }}>{config.label}</span>
          </CardTitle>

          {/* Resumo financeiro */}
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: "var(--muted-foreground)" }}>
              {paidCount}/{expenses.length} pago{paidCount !== 1 ? "s" : ""}
            </span>
            <div className="text-right">
              <div className="font-semibold" style={{ color: config.accentVar }}>
                Total: R$ {total.toFixed(2)}
              </div>
              {pendingTotal > 0 && (
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Pendente: R$ {pendingTotal.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div
          className="h-1.5 rounded-full mt-3 overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${expenses.length > 0 ? (paidCount / expenses.length) * 100 : 0}%`,
              background: "var(--financial-success, #22c55e)",
            }}
          />
        </div>
      </CardHeader>

      {/* Lista de despesas */}
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center py-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Nenhuma despesa encontrada para este tipo de pagamento.
          </p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onTogglePaid={onTogglePaid}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ── Componente principal: Payments ───────────────────────────────────

export function Payments() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "PAID">("ALL");

  // ── Busca as despesas ao montar o componente ──
  useEffect(() => {
    costService
      .getAll()
      .then((data: Cost[]) => setCosts(data))
      .catch(() =>
        setToast({ message: "Erro ao carregar despesas.", type: "error" })
      )
      .finally(() => setLoading(false));
  }, []);

  // ── Toggle pago/pendente: atualiza API + estado local ──
  const handleTogglePaid = async (id: string, paid: boolean) => {
    const expense = costs.find((c) => c.id === id);
    if (!expense) return;

    try {
      await costService.update(Number(id), { ...expense, paid });
      setCosts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, paid } : c))
      );
      setToast({
        message: paid
          ? "Despesa marcada como paga!"
          : "Despesa marcada como pendente.",
        type: "success",
      });
    } catch {
      setToast({ message: "Erro ao atualizar despesa.", type: "error" });
    }
  };

  // ── Filtra somente Cartão de Crédito e Boleto ──
  const paymentExpenses = useMemo(
    () =>
      costs.filter(
        (c) =>
          c.paymentType === "Cartão de Crédito" || c.paymentType === "Boleto"
      ),
    [costs]
  );

  // ── Aplica filtro de status ──
  const filtered = useMemo(() => {
    if (filterStatus === "PENDING") return paymentExpenses.filter((e) => !e.paid);
    if (filterStatus === "PAID") return paymentExpenses.filter((e) => e.paid);
    return paymentExpenses;
  }, [paymentExpenses, filterStatus]);

  // ── Agrupa por tipo ──
  const grouped = useMemo(() => {
    const result: Record<PaymentType, Cost[]> = {
      "Cartão de Crédito": [],
      Boleto: [],
    };
    filtered.forEach((e) => {
      if (e.paymentType === "Cartão de Crédito" || e.paymentType === "Boleto") {
        result[e.paymentType as PaymentType].push(e);
      }
    });
    return result;
  }, [filtered]);

  // ── Totais globais ──
  const grandTotal = paymentExpenses.reduce((acc, e) => acc + Number(e.value), 0);
  const pendingTotal = paymentExpenses
    .filter((e) => !e.paid)
    .reduce((acc, e) => acc + Number(e.value), 0);
  const paidTotal = grandTotal - pendingTotal;

  const typesWithItems = (Object.keys(grouped) as PaymentType[]).filter(
    (t) => grouped[t].length > 0
  );

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p style={{ color: "var(--muted-foreground)" }}>
          Carregando pagamentos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-1">

      {/* ── Cabeçalho da aba ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            💳 Pagamentos
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Acompanhe o que ainda precisa ser pago
          </p>
        </div>

        {/* Filtro de status */}
        <div
          className="flex gap-1 p-1 rounded-xl border"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          {(["ALL", "PENDING", "PAID"] as const).map((s) => (
            <Button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: filterStatus === s ? "var(--primary)" : "transparent",
                color:
                  filterStatus === s
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
              }}
            >
              {s === "ALL" ? "Todos" : s === "PENDING" ? "Pendentes" : "Pagos"}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Cards de resumo global ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Geral",
            value: grandTotal,
            colorVar: "var(--foreground)",
            emoji: "📊",
          },
          {
            label: "Pendente",
            value: pendingTotal,
            colorVar: "var(--financial-danger)",
            emoji: "⏳",
          },
          {
            label: "Pago",
            value: paidTotal,
            colorVar: "var(--financial-success, #22c55e)",
            emoji: "✅",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="text-xl">{item.emoji}</div>
            <div
              className="font-bold text-sm mt-1"
              style={{ color: item.colorVar }}
            >
              R$ {item.value.toFixed(2)}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Seções agrupadas por tipo ── */}
      {paymentExpenses.length === 0 ? (
        <Card
          className="border"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <CardContent className="py-10 text-center">
            <p className="text-4xl mb-3">💳</p>
            <p style={{ color: "var(--muted-foreground)" }}>
              Nenhuma despesa com Cartão de Crédito ou Boleto cadastrada ainda.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              Cadastre despesas na aba{" "}
              <strong style={{ color: "var(--foreground)" }}>Despesas</strong> e
              selecione o tipo de pagamento.
            </p>
          </CardContent>
        </Card>
      ) : typesWithItems.length === 0 ? (
        <Card
          className="border"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <CardContent className="py-8 text-center">
            <p style={{ color: "var(--muted-foreground)" }}>
              Nenhuma despesa encontrada para o filtro selecionado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {(["Cartão de Crédito", "Boleto"] as PaymentType[]).map(
            (type) =>
              grouped[type].length > 0 && (
                <PaymentSection
                  key={type}
                  paymentType={type}
                  expenses={grouped[type]}
                  onTogglePaid={handleTogglePaid}
                />
              )
          )}
        </div>
      )}

      {/* Toast de feedback */}
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