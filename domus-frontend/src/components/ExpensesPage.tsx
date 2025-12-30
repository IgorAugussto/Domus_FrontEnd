// src/components/ExpensesPage.tsx
import React, { useState, useEffect } from "react";
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
import { DollarSign, Plus } from "lucide-react";
import { costService } from "../service/costService";
import { EditEntityModal } from "./EditEntityModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

const formatDateToISO = (date: string) => {
  if (!date) return "";
  return date; // input[type=date] já retorna yyyy-MM-dd
};

export default function ExpensesPage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [costs, setCosts] = useState<any[]>([]);
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [selectedCost, setSelectedCost] = useState<any>(null);
  const [editingCost, setEditingCost] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deletingCost, setDeletingCost] = useState<any | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    loadCosts();
  }, []);

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
      });

      await loadCosts();

      alert("Income salvo com sucesso!");

      // Limpa o formulário
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Erro ao salvar income:", error);
      alert("Erro ao salvar renda. Tente novamente.");
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
          Add Expense
        </h1>
      </div>

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
            New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
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
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger
                    className="select-trigger"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Food & Dining">
                      Food & Dining
                    </SelectItem>
                    <SelectItem className="select-item" value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem className="select-item" value="Shopping">
                      Shopping
                    </SelectItem>
                    <SelectItem className="select-item" value="Entertainment">
                      Entertainment
                    </SelectItem>
                    <SelectItem
                      className="select-item"
                      value="Bills & Utilities"
                    >
                      Bills & Utilities
                    </SelectItem>
                    <SelectItem className="select-item" value="Healthcare">
                      Healthcare
                    </SelectItem>
                    <SelectItem className="select-item" value="Education">
                      Education
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* FREQUENCY */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {/*<SelectItem className="select-item" value="One-time">
                      One-time
                    </SelectItem>
                    <SelectItem className="select-item" value="Weekly">
                      Weekly
                    </SelectItem>
                    <SelectItem className="select-item" value="Bi-weekly">
                      Bi-weekly
                    </SelectItem>*/}
                    <SelectItem className="select-item" value="Monthly">
                      Monthly
                    </SelectItem>
                    {/*<SelectItem className="select-item" value="Quarterly">
                      Quarterly
                    </SelectItem>
                    <SelectItem className="select-item" value="Annually">
                      Annually
                    </SelectItem>*/}
                  </SelectContent>
                </Select>
              </div>

              {/* 🔥 DURATION (ENTRA AQUI, LOGO ABAIXO) */}
              {showDurationInput && (
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {frequency === "Weekly" && "Number of weeks"}
                    {frequency === "Bi-weekly" && "Number of bi-weekly periods"}
                    {frequency === "Monthly" && "Number of months"}
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
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
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
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE DESPESAS */}
      <Card style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--card-foreground)" }}>
            Recent Expenses
          </CardTitle>
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
              {costs.map((inc: any) => (
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
                        {inc.description} - {inc.frequency}
                      </span>
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
        </CardContent>
      </Card>

      {/* MODAL EDIT */}
      {editingCost && (
        <EditEntityModal
          open={showEdit}
          title="Edit expense"
          initialData={editingCost}
          showDurationInMonths={true}
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
    </div>
  );
}
