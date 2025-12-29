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

export default function InvestmentsPage() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    loadInvestment();
  }, []);

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

      alert("Income salvo com sucesso!");

      // limpa o formulário (apenas visualmente)
      setAmount("");
      setType("");
      setExpectedReturn("");
      setDescription("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Erro ao salvar income:", err);
      alert("Erro ao salvar renda. Tente novamente.");
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
          Add Investment
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
            New Investment
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
                <Label htmlFor="Date">Date</Label>
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
                <Label htmlFor="type">Investment Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger
                    className="select-trigger"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Stocks">
                      Stocks
                    </SelectItem>
                    <SelectItem className="select-item" value="Bonds">
                      Bonds
                    </SelectItem>
                    <SelectItem className="select-item" value="Real Estate">
                      Real Estate
                    </SelectItem>
                    <SelectItem className="select-item" value="Crypto">
                      Cryptocurrency
                    </SelectItem>
                    <SelectItem className="select-item" value="Mutual Funds">
                      Mutual Funds
                    </SelectItem>
                    <SelectItem className="select-item" value="ETF">
                      ETF
                    </SelectItem>
                    <SelectItem className="select-item" value="Savings">
                      Savings Account
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
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
                <Label htmlFor="Date">Final Date</Label>
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
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Details about this investment"
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
              Add Investment
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
                  <div className="flex justify-between">
                    <span>
                      {inc.description} - {inc.frequency}
                    </span>
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
