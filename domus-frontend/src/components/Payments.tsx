// =====================================================================
// Payments.tsx — Aba "Pagamentos"
// =====================================================================

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
import { FeedbackToast } from "../components/FeedbackToast";
import { paymentStatusService, type PaymentMonthItem } from "../service/Paymentstatusservice";

export type PaymentType = "Cartão de Crédito" | "Boleto";

const MONTH_NAMES: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março",
  "04": "Abril",   "05": "Maio",      "06": "Junho",
  "07": "Julho",   "08": "Agosto",    "09": "Setembro",
  "10": "Outubro", "11": "Novembro",  "12": "Dezembro",
};

const PAYMENT_CONFIG: Record<string, {
  accentVar: string;
  bgClass: string;
  borderClass: string;
}> = {
  "Cartão de Crédito": {
    accentVar: "var(--financial-danger)",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-400/40",
  },
  Boleto: {
    accentVar: "var(--financial-investment, #f59e0b)",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-400/40",
  },
};

// ── Utilitários ──────────────────────────────────────────────

function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatYearMonth(ym: string): string {
  const [year, month] = ym.split("-");
  return `${MONTH_NAMES[month] ?? month} ${year}`;
}

function addMonths(ym: string, delta: number): string {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// ── Linha de despesa ─────────────────────────────────────────

function PaymentRow({
  item,
  onToggle,
}: {
  item: PaymentMonthItem;
  onToggle: (outgoingId: number, paid: boolean) => void;
}) {
  const config = PAYMENT_CONFIG[item.paymentType] ?? PAYMENT_CONFIG["Cartão de Crédito"];

  return (
    <li
      className="p-3 rounded-lg border flex justify-between items-center gap-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        opacity: item.paid ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="font-medium truncate"
          style={{
            textDecoration: item.paid ? "line-through" : "none",
            color: "var(--card-foreground)",
          }}
        >
          {item.description}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {item.frequency === "Monthly" ? "Mensal" : "Único"}
          {" · "}
          <span style={{ color: config.accentVar }}>{item.paymentType}</span>
        </span>
      </div>

      <strong
        className="shrink-0 text-sm"
        style={{ color: item.paid ? "var(--muted-foreground)" : config.accentVar }}
      >
        R$ {Number(item.value).toFixed(2)}
      </strong>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
            item.paid
              ? "border-green-400/40 bg-green-500/10"
              : `${config.borderClass} ${config.bgClass}`
          }`}
          style={{ color: item.paid ? "var(--financial-success)" : config.accentVar }}
        >
          {item.paid ? "Pago" : "Pendente"}
        </span>

        <button
          type="button"
          title={item.paid ? "Marcar como pendente" : "Marcar como pago"}
          onClick={() => onToggle(item.outgoingId, !item.paid)}
          className="cursor-pointer transition-opacity hover:opacity-70"
        >
          {item.paid ? "↩️" : "✅"}
        </button>
      </div>
    </li>
  );
}

// ── Componente principal ─────────────────────────────────────

export function Payments() {
  const [yearMonth, setYearMonth] = useState<string>(getCurrentYearMonth());
  const [payments, setPayments] = useState<PaymentMonthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const currentYearMonth = getCurrentYearMonth();
  const isCurrentMonth = yearMonth === currentYearMonth;

  // ── Carrega os pagamentos do mês selecionado ──
  useEffect(() => {
    setLoading(true);
    paymentStatusService
      .getByMonth(yearMonth)
      .then(setPayments)
      .catch(() => setToast({ message: "Erro ao carregar pagamentos.", type: "error" }))
      .finally(() => setLoading(false));
  }, [yearMonth]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Toggle individual por mês ──
  const handleToggle = async (outgoingId: number, paid: boolean) => {
    try {
      const updated = await paymentStatusService.toggle(outgoingId, yearMonth, paid);
      setPayments((prev) =>
        prev.map((p) => (p.outgoingId === outgoingId ? { ...p, paid: updated.paid } : p))
      );
      setToast({
        message: paid ? "Marcado como pago!" : "Marcado como pendente.",
        type: "success",
      });
    } catch {
      setToast({ message: "Erro ao atualizar pagamento.", type: "error" });
    }
  };

  // ── Pagar todos do mês ──
  const handlePayAll = async () => {
    const pending = payments.filter((p) => !p.paid);
    if (pending.length === 0) return;
    try {
      await Promise.all(
        pending.map((p) => paymentStatusService.toggle(p.outgoingId, yearMonth, true))
      );
      setPayments((prev) => prev.map((p) => ({ ...p, paid: true })));
      setToast({ message: "Todos os pagamentos do mês marcados como pagos!", type: "success" });
    } catch {
      setToast({ message: "Erro ao atualizar pagamentos.", type: "error" });
    }
  };

  // ── Filtra por status ──
  const filtered = useMemo(() => {
    if (filterStatus === "PENDING") return payments.filter((p) => !p.paid);
    if (filterStatus === "PAID") return payments.filter((p) => p.paid);
    return payments;
  }, [payments, filterStatus]);

  // ── Totais ──
  const grandTotal = payments.reduce((acc, p) => acc + Number(p.value), 0);
  const pendingTotal = payments.filter((p) => !p.paid).reduce((acc, p) => acc + Number(p.value), 0);
  const paidTotal = grandTotal - pendingTotal;
  const paidCount = payments.filter((p) => p.paid).length;
  const allPaid = payments.length > 0 && paidCount === payments.length;

  const filterOptions: {
    key: "ALL" | "PENDING" | "PAID";
    label: string;
    activeColor: string;
    activeBg: string;
  }[] = [
    { key: "ALL",     label: "Todos",     activeColor: "var(--financial-trust)",   activeBg: "rgba(59,130,246,0.18)"  },
    { key: "PENDING", label: "Pendentes", activeColor: "var(--financial-danger)",  activeBg: "rgba(239,68,68,0.18)"   },
    { key: "PAID",    label: "Pagos",     activeColor: "var(--financial-success)", activeBg: "rgba(16,185,129,0.18)"  },
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

        {/* Filtros de status */}
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

      {/* ── Seletor de mês ── */}
      <Card style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <CardContent className="py-3">
          <div className="flex items-center justify-between gap-3">

            {/* Botão mês anterior */}
            <button
              type="button"
              onClick={() => setYearMonth((ym) => addMonths(ym, -1))}
              onMouseEnter={() => setHoveredNav("prev")}
              onMouseLeave={() => setHoveredNav(null)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background: hoveredNav === "prev" ? "rgba(59,130,246,0.12)" : "transparent",
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              ← Anterior
            </button>

            {/* Mês atual */}
            <div className="text-center">
              <span
                className="font-semibold text-base"
                style={{ color: "var(--financial-trust)" }}
              >
                {formatYearMonth(yearMonth)}
              </span>
              {isCurrentMonth && (
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "var(--financial-trust)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  mês atual
                </span>
              )}
            </div>

            {/* Botão próximo mês */}
            <button
              type="button"
              onClick={() => setYearMonth((ym) => addMonths(ym, 1))}
              onMouseEnter={() => setHoveredNav("next")}
              onMouseLeave={() => setHoveredNav(null)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background: hoveredNav === "next" ? "rgba(59,130,246,0.12)" : "transparent",
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Próximo →
            </button>
          </div>

          {/* Botão voltar para mês atual — só aparece quando está em outro mês */}
          {!isCurrentMonth && (
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => setYearMonth(getCurrentYearMonth())}
                className="text-xs cursor-pointer hover:opacity-70 transition-opacity"
                style={{ color: "var(--financial-trust)" }}
              >
                Voltar para o mês atual
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Cards de resumo ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Geral", value: grandTotal,   colorVar: "var(--card-foreground)",  emoji: "📊", borderColor: "var(--border)"          },
          { label: "Pendente",    value: pendingTotal, colorVar: "var(--financial-danger)",  emoji: "⏳", borderColor: "rgba(239,68,68,0.3)"     },
          { label: "Pago",        value: paidTotal,    colorVar: "var(--financial-success)", emoji: "✅", borderColor: "rgba(16,185,129,0.3)"    },
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

      {/* ── Lista de pagamentos do mês ── */}
      <Card style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base" style={{ color: "var(--card-foreground)" }}>
              {formatYearMonth(yearMonth)}
              <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>
                {paidCount}/{payments.length} pago{paidCount !== 1 ? "s" : ""}
              </span>
            </CardTitle>

            {/* Botão pagar todos — só aparece se houver pendentes */}
            {!allPaid && payments.length > 0 && (
              <button
                type="button"
                onClick={handlePayAll}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer hover:opacity-80"
                style={{
                  borderColor: "var(--financial-success)",
                  color: "var(--financial-success)",
                  background: "rgba(16,185,129,0.1)",
                }}
              >
                ✅ Pagar todos do mês
              </button>
            )}
          </div>

          {/* Barra de progresso */}
          <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${payments.length > 0 ? (paidCount / payments.length) * 100 : 0}%`,
                background: "var(--financial-success)",
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {payments.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-3">📭</p>
              <p style={{ color: "var(--muted-foreground)" }}>
                Nenhuma despesa encontrada para {formatYearMonth(yearMonth)}.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                Use ← e → para navegar entre os meses.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Nenhuma despesa encontrada para o filtro selecionado.
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((item) => (
                <PaymentRow
                  key={item.outgoingId}
                  item={item}
                  onToggle={handleToggle}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

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