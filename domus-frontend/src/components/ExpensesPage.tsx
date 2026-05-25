// src/components/ExpensesPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui-components/select";
import { Textarea } from "../ui-components/textArea";
import { DollarSign, Plus, Upload } from "lucide-react";
import { costService } from "../service/costService";
import { statementService } from "../service/statementService";
import { EditEntityModal } from "./EditEntityModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { FeedbackToast } from "./FeedbackToast";
import { expenseCategoryLabels } from "../utils/labels/expenseCategoryLabels";
import { frequencyLabels } from "../utils/labels/frequencyLabels";
import { expenseDescriptionLabel } from "../utils/labels/expenseDescriptionLabel";

const formatDateToISO = (date: string) => {
  if (!date) return "";
  return date;
};

export default function ExpensesPage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [costs, setCosts] = useState<any[]>([]);
  const [frequency, setFrequency] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [selectedCost, setSelectedCost] = useState<any>(null);
  const [editingCost, setEditingCost] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deletingCost, setDeletingCost] = useState<any | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ── Estados do import de extrato ──
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState(""); // data de vencimento
  const [importJobId, setImportJobId] = useState<string | null>(null); // jobId do processamento assíncrono
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCosts();
  }, []);

  // ── Polling de status do job de importação ───────────────────────────────
  // Inicia quando importJobId é definido, para quando job termina ou timeout.
  // ⚠️ Removemos o auto-close do toast: o usuário precisa fechar manualmente.
  useEffect(() => {
    if (!importJobId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 60; // 60 × 2s = 2 minutos de timeout máximo

    const pollInterval = setInterval(async () => {
      attempts++;
      try {
        const statusData = await statementService.getStatus(importJobId);

        if (statusData.status === "DONE" && statusData.result) {
          clearInterval(pollInterval);
          setImportJobId(null);
          setImporting(false);
          await loadCosts();

          const { saved, total, skipped, errors } = statusData.result;
          if (errors.length > 0) {
            setToast({
              message: `${saved} de ${total} despesas importadas. ${errors.length} erro(s).`,
              type: "error",
            });
          } else if (skipped > 0 && saved === 0) {
            setToast({
              message: `Nenhuma nova despesa. ${skipped} já estavam cadastradas.`,
              type: "success",
            });
          } else if (skipped > 0) {
            setToast({
              message: `${saved} novas despesas importadas. ${skipped} já existiam e foram ignoradas.`,
              type: "success",
            });
          } else {
            setToast({
              message: `${saved} despesas importadas com sucesso!`,
              type: "success",
            });
          }

        } else if (statusData.status === "ERROR") {
          clearInterval(pollInterval);
          setImportJobId(null);
          setImporting(false);
          setToast({ message: "Erro ao processar extrato. Tente novamente.", type: "error" });

        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          setImportJobId(null);
          setImporting(false);
          setToast({ message: "Tempo de espera excedido. Tente novamente.", type: "error" });
        }
        // PENDING / PROCESSING → continua aguardando

      } catch (err) {
        console.error("Erro ao verificar status do job:", err);
        // Mantém o polling em erros de rede — pode ser instabilidade temporária
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [importJobId]);

  const loadCosts = async () => {
    try {
      const data = await costService.getAll();
      setCosts(data);
    } catch (err) {
      console.error("Erro ao carregar costs:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Preencha todos os campos!");
      return;
    }

    if (frequency !== "One-time" && !duration) {
      alert("Informe a duração para despesas recorrentes");
      return;
    }

    try {
      await costService.create({
        description: description || `${category}`,
        amount: Number(amount),
        startDate: formatDateToISO(date),
        category,
        frequency,
        durationInMonths: frequency === "One-time" ? 1 : duration,
        paymentType,
        paid: false,
      });

      await loadCosts();

      setToast({ message: "Despesa salva com sucesso", type: "success" });

      setAmount("");
      setCategory("");
      setDescription("");
      setPaymentType("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      setToast({ message: "Preencha todos os campos", type: "error" });
    }
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    if (value === "One-time") {
      setDuration(1);
      setShowDurationInput(false);
    } else {
      setDuration(null);
      setShowDurationInput(true);
    }
  };

  const handleDeleteCost = async () => {
    if (!selectedCost) return;
    try {
      await costService.delete(selectedCost.id);
      await loadCosts();
      setShowDelete(false);
    } catch (error) {
      console.error("Erro ao deletar cost:", error);
      alert("Erro ao deletar renda.");
    }
  };

  const handleEditCost = async (data: any) => {
    if (!editingCost) return;
    try {
      await costService.update(editingCost.id, data);
      await loadCosts();
      setShowEdit(false);
      setEditingCost(null);
    } catch (error) {
      console.error("Erro ao editar cost:", error);
      alert("Erro ao editar cost.");
    }
  };

  // ── Handler de seleção de arquivo ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith(".csv") && !name.endsWith(".ofx") && !name.endsWith(".pdf")) {
      setToast({ message: "Formato inválido. Envie um arquivo CSV, OFX ou PDF.", type: "error" });
      return;
    }

    setSelectedFile(file);
    setDueDate(""); // ✅ limpa a data ao selecionar novo arquivo
  };

  // ── Handler de import (assíncrono via RabbitMQ) ─────────────────────────
  const handleImport = async () => {
    if (!selectedFile || !dueDate) return;

    setImporting(true);
    try {
      // Envia o arquivo → backend responde imediatamente com { jobId }
      const { jobId } = await statementService.import(selectedFile, dueDate);

      // Limpa os inputs imediatamente (arquivo já foi enviado ao servidor)
      setSelectedFile(null);
      setDueDate("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Inicia o polling — o useEffect acima cuida do resto
      setImportJobId(jobId);

    } catch (error) {
      console.error("Erro ao enviar extrato:", error);
      setToast({ message: "Erro ao enviar arquivo. Tente novamente.", type: "error" });
      setImporting(false); // só reseta aqui em caso de erro no envio
      // Se o envio funcionou, o polling é quem chama setImporting(false)
    }
  };

  const filteredCosts = costs.filter((cost) => {
    if (filter === "ALL") return true;
    return cost.frequency === filter;
  });

  const totalPages = Math.ceil(filteredCosts.length / itemsPerPage);

  const paginatedCosts = filteredCosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--financial-danger-light)" }}
        >
          <DollarSign
            className="h-6 w-6"
            style={{ color: "var(--financial-danger)" }}
          />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--financial-danger)" }}
        >
          Adicionar Despesa
        </h1>
      </div>

      {/* IMPORTAR EXTRATO */}
      <Card
        style={{
          background: "var(--card)",
          borderColor: "var(--financial-trust)",
          color: "var(--card-foreground)",
        }}
      >
        <CardHeader style={{ background: "var(--financial-trust-light)" }}>
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--financial-trust)" }}
          >
            <Upload className="h-5 w-5" />
            Importar Extrato
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
            Importe seu extrato do <strong>Nubank</strong> (CSV ou OFX) ou do <strong>Itaú</strong> (PDF).
            As despesas serão adicionadas automaticamente como "Cartão de Crédito".
          </p>

          <div className="flex flex-col gap-4">

            {/* Banner: processamento em andamento (exibido durante o polling) */}
            {importing && importJobId && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm"
                style={{
                  borderColor: "var(--financial-trust)",
                  background: "rgba(59,130,246,0.08)",
                  color: "var(--financial-trust)",
                }}
              >
                <span className="animate-spin text-base">⏳</span>
                <span>
                  Processando extrato em segundo plano… você pode usar o sistema normalmente.
                </span>
              </div>
            )}

            {/* Seletor de arquivo (oculto durante o processamento) */}
            {!importing && (
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.ofx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="statement-file-input"
                />

                <label
                  htmlFor="statement-file-input"
                  className="cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150"
                  style={{
                    borderColor: "var(--financial-trust)",
                    color: "var(--financial-trust)",
                    background: "rgba(59,130,246,0.08)",
                  }}
                >
                  {selectedFile ? `📄 ${selectedFile.name}` : "Selecionar arquivo"}
                </label>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setDueDate("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs cursor-pointer hover:opacity-70"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    ✕ Cancelar
                  </button>
                )}
              </div>
            )}

            {/* ✅ Linha 2: campo de data de vencimento — aparece só após selecionar arquivo */}
            {selectedFile && (
              <div className="flex flex-col gap-2 p-3 rounded-lg border"
                style={{ borderColor: "var(--financial-trust)", background: "rgba(59,130,246,0.05)" }}
              >
                <Label
                  htmlFor="due-date"
                  className="text-sm font-medium"
                  style={{ color: "var(--financial-trust)" }}
                >
                  📅 Qual é a data de vencimento desta fatura?
                </Label>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Todas as despesas importadas serão alocadas nesta data.
                </p>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    borderColor: "var(--financial-trust)",
                    maxWidth: "200px",
                  }}
                />

                {/* Botão de importar — só aparece quando arquivo e data estão preenchidos */}
                {dueDate && !importing && (
                  <Button
                    type="button"
                    onClick={handleImport}
                    className="mt-1 w-fit"
                    style={{ background: "var(--financial-trust)", color: "white" }}
                  >
                    Subir Arquivo
                  </Button>
                )}
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* FORMULÁRIO */}
      <Card
        style={{
          background: "var(--card)",
          borderColor: "var(--financial-danger)",
          color: "var(--card-foreground)",
        }}
      >
        <CardHeader style={{ background: "var(--financial-danger-light)" }}>
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--financial-danger)" }}
          >
            <Plus className="h-5 w-5" />
            Nova Despesa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger
                    className="select-trigger"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <SelectValue placeholder="Selecionar Categoria" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Food & Dining">
                      Alimentação
                    </SelectItem>
                    <SelectItem className="select-item" value="Transportation">
                      Transporte
                    </SelectItem>
                    <SelectItem className="select-item" value="Shopping">
                      Compras
                    </SelectItem>
                    <SelectItem className="select-item" value="Entertainment">
                      Lazer
                    </SelectItem>
                    <SelectItem className="select-item" value="Bills & Utilities">
                      Contas e Serviços
                    </SelectItem>
                    <SelectItem className="select-item" value="Healthcare">
                      Saúde
                    </SelectItem>
                    <SelectItem className="select-item" value="Education">
                      Educação
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Outros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FREQUENCY */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequencia</Label>
                <Select value={frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Selecionar Frequência" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="One-time">
                      Único
                    </SelectItem>
                    <SelectItem className="select-item" value="Monthly">
                      Mensal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TIPO DE PAGAMENTO */}
              <div className="space-y-2">
                <Label htmlFor="paymentType">Tipo de Pagamento</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Selecionar Tipo de Pagamento" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Cartão de Crédito">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem className="select-item" value="Boleto">
                      Boleto
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DURATION */}
              {showDurationInput && (
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {frequency === "Weekly" && "Number of weeks"}
                    {frequency === "Bi-weekly" && "Number of bi-weekly periods"}
                    {frequency === "Monthly" && "Número de parcelas"}
                    {frequency === "Quarterly" && "Number of quarters"}
                    {frequency === "Annually" && "Number of years"}
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={duration ?? ""}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descrição da despesa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{
                background: "var(--financial-danger)",
                color: "white",
              }}
            >
              Adicionar Despesa
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE DESPESAS */}
      <Card style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle style={{ color: "var(--card-foreground)" }}>
            Despesas Recentes
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent className="select-trigger">
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="One-time">Único</SelectItem>
              <SelectItem value="Monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <p
              className="text-center py-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              No income added yet
            </p>
          ) : (
            <ul className="space-y-3">
              {paginatedCosts.map((inc: any) => (
                <li
                  key={inc.id}
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--card)",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span>
                        {inc.description && inc.description.trim() !== ""
                          ? (expenseDescriptionLabel[inc.description] ??
                            inc.description)
                          : (expenseCategoryLabels[inc.category] ??
                            inc.category)}
                        {" - "}
                        {frequencyLabels[inc.frequency] ?? inc.frequency}
                      </span>
                      {inc.startDate && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {new Date(inc.startDate + "T00:00:00")
                            .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                            .replace(/^./, (c) => c.toUpperCase())}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <strong style={{ color: "var(--financial-danger)" }}>
                        ${inc.value}
                      </strong>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingCost(inc);
                          setShowEdit(true);
                        }}
                        className="hover:opacity-70 cursor-pointer"
                        title="Edit outgoing"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeletingCost(inc);
                          setSelectedCost(inc);
                          setShowDelete(true);
                        }}
                        className="hover:opacity-70 cursor-pointer"
                        title="Delete outgoing"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL EDIT */}
      {editingCost && (
        <EditEntityModal
          open={showEdit}
          title="Edit expense"
          initialData={editingCost}
          showDurationInMonths={true}
          showExpenseCategories={true}
          onSave={handleEditCost}
          onCancel={() => {
            setShowEdit(false);
            setEditingCost(null);
          }}
        />
      )}

      {/* MODAL DELETE */}
      {deletingCost && (
        <DeleteConfirmModal
          open={showDelete}
          title="Delete Cost?"
          description="This action cannot be undone. This Cost will be permanently removed."
          onConfirm={handleDeleteCost}
          onCancel={() => {
            setShowDelete(false);
            setDeletingCost(null);
            setSelectedCost(null);
          }}
        />
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