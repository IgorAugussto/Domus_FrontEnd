// src/components/InvestmentsPage.tsx
import React, { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card";
import { Plus, TrendingUp } from "lucide-react";
import { investmentService } from "../service/investmentService";
import { EditEntityModal } from "./EditEntityModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { FeedbackToast } from "./FeedbackToast";

export default function InvestmentsPage() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [investments, setInvestments] = useState<any[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [editingInvestment, setEditingInvestment] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deletingInvestment, setDeletingInvestment] = useState<any | null>(
    null,
  );
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    loadInvestment();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const loadInvestment = async () => {
    try {
      const data = await investmentService.getAll();
      setInvestments(data);
    } catch (err) {
      console.error("Erro ao carregar investments:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Apenas impede o envio sem dados (por enquanto sem salvar nada)
    if (!amount || !type || !expectedReturn || !startDate || !endDate) return;

    try {
      await investmentService.create({
        description: description || `${type}`,
        amount: Number(amount),
        startDate,
        endDate,
        type,
        expectedReturn,
      });

      await loadInvestment();

      setToast({
        message: "Investimento salva com sucesso",
        type: "success",
      });

      // limpa o formulário (apenas visualmente)
      setAmount("");
      setType("");
      setExpectedReturn("");
      setDescription("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Erro ao salvar investimento:", err);
      setToast({
        message: "Preencha todos os campos",
        type: "error",
      });
    }
  };

  const handleDeleteInvestment = async () => {
    if (!selectedInvestment) return;

    try {
      await investmentService.delete(selectedInvestment.id);
      await loadInvestment();
      setShowDelete(false);
    } catch (error) {
      console.error("Erro ao deletar income:", error);
      alert("Erro ao deletar renda.");
    }
  };

  const handleEditInvestment = async (data: any) => {
    if (!editingInvestment) return;

    try {
      await investmentService.update(editingInvestment.id, data);
      await loadInvestment();
      setShowEdit(false);
      setEditingInvestment(null);
    } catch (error) {
      console.error("Erro ao editar income:", error);
      alert("Erro ao editar income.");
    }
  };

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--financial-investment-light)" }}
        >
          <TrendingUp
            className="h-6 w-6"
            style={{ color: "var(--financial-investment)" }}
          />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--financial-investment)" }}
        >
          Adicionar Investimento
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card
        style={{
          background: "var(--card)",
          borderColor: "var(--financial-investment)",
          color: "var(--card-foreground)",
        }}
      >
        <CardHeader style={{ background: "var(--financial-investment-light)" }}>
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--financial-investment)" }}
          >
            <Plus className="h-5 w-5" />
            Novo Investimento
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
                <Label htmlFor="Date">Data</Label>
                <Input
                  id="startDate"
                  type="Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Investimento</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger
                    className="select-trigger"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Stocks">
                      Ações
                    </SelectItem>
                    <SelectItem className="select-item" value="Bonds">
                      Renda Fixa
                    </SelectItem>
                    <SelectItem className="select-item" value="Real Estate">
                      Imóveis
                    </SelectItem>
                    <SelectItem className="select-item" value="Crypto">
                      Criptomoedas
                    </SelectItem>
                    <SelectItem className="select-item" value="Mutual Funds">
                      Fundos de Investimento
                    </SelectItem>
                    <SelectItem className="select-item" value="ETF">
                      ETF
                    </SelectItem>
                    <SelectItem className="select-item" value="Savings">
                      Poupança
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Outros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Rentabilidade Esperada (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  placeholder="5.7"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Date">Data Final</Label>
                <Input
                  id="endDate"
                  type="Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Detalhes sobre este investimento"
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
                background: "var(--financial-investment)",
                color: "white",
              }}
            >
              Adicionar Investimento
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE INVESTIMENTOS */}
      <Card style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--card-foreground)" }}>
            Recent Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <p
              className="text-center py-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              No investments added yet
            </p>
          ) : (
            <ul className="space-y-3">
              {investments.map((inc: any) => (
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
                        {inc.description} - {inc.expectedReturn}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <strong style={{ color: "var(--financial-income)" }}>
                        ${inc.value}
                      </strong>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingInvestment(inc);
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
                          setDeletingInvestment(inc);
                          setSelectedInvestment(inc);
                          setShowDelete(true);
                        }}
                        className="hover:opacity-70 cursor-pointer"
                        title="Delete outgoing"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{inc.date}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* MODAL EDIT */}
      {editingInvestment && (
        <EditEntityModal
          open={showEdit}
          title="Edit investment"
          initialData={editingInvestment}
          onSave={handleEditInvestment}
          onCancel={() => setShowEdit(false)}
          showFieldsInvestments
        />
      )}

      {/* MODAL DELETE */}
      {deletingInvestment && (
        <DeleteConfirmModal
          open={showDelete}
          title="Delete investment?"
          description="This action cannot be undone. This investment will be permanently removed."
          onConfirm={handleDeleteInvestment}
          onCancel={() => {
            setShowDelete(false);
            setDeletingInvestment(null);
            setSelectedInvestment(null);
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
