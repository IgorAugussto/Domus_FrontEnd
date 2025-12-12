// src/components/IncomePage.tsx
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
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";
import { Plus, Wallet } from "lucide-react";
import { incomeService } from "../service/incomeService";

export default function IncomePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [frequency, setFrequency] = useState("");

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      const data = await incomeService.getAll();
      setIncomes(data);
    } catch (err) {
      console.error("Erro ao carregar incomes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await incomeService.create({
        description: description || `${category}`,
        amount: Number(amount),
        date,
        category,
        frequency,
      });

      await loadIncomes();

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

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--financial-income-light)" }}
        >
          <Wallet
            className="h-6 w-6"
            style={{ color: "var(--financial-income)" }}
          />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--financial-income)" }}
        >
          Add Income
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card
        style={{
          background: "var(--card)",
          borderColor: "var(--financial-income)",
          color: "var(--card-foreground)",
        }}
      >
        <CardHeader style={{ background: "var(--financial-income-light)" }}>
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--financial-income)" }}
          >
            <Plus className="h-5 w-5" />
            New Income
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
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Salary">
                      Salary
                    </SelectItem>
                    <SelectItem className="select-item" value="Freelance">
                      Freelance
                    </SelectItem>
                    <SelectItem className="select-item" value="Bonus">
                      Bonus
                    </SelectItem>
                    <SelectItem className="select-item" value="Investment">
                      Investment Returns
                    </SelectItem>
                    <SelectItem className="select-item" value="Gift">
                      Gift
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="One-time">
                      One-time
                    </SelectItem>
                    <SelectItem className="select-item" value="Weekly">
                      Weekly
                    </SelectItem>
                    <SelectItem className="select-item" value="Bi-weekly">
                      Bi-weekly
                    </SelectItem>
                    <SelectItem className="select-item" value="Monthly">
                      Monthly
                    </SelectItem>
                    <SelectItem className="select-item" value="Quarterly">
                      Quarterly
                    </SelectItem>
                    <SelectItem className="select-item" value="Annually">
                      Annually
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Details about this income"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ background: "var(--financial-income)", color: "white" }}
            >
              Add Income
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE INCOME */}
      <Card style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--card-foreground)" }}>
            Recent Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length === 0 ? (
            <p
              className="text-center py-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              No income added yet
            </p>
          ) : (
            <ul className="space-y-3">
              {incomes.map((inc: any) => (
                <li
                  key={inc.id}
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--card)",
                  }}
                >
                  <div className="flex justify-between">
                    <span>{inc.description}</span>
                    <strong style={{ color: "var(--financial-income)" }}>
                      ${inc.value}
                    </strong>
                  </div>
                  <p className="text-sm text-muted-foreground">{inc.date}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
