// src/components/IncomePage.tsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from "../ui-components/card";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui-components/select";
import { Textarea } from "../ui-components/textArea";
import { Wallet, Plus, Trash2 } from "lucide-react";

interface Income {
  id: string;
  amount: number;
  source: string;
  frequency: string;
  date: string;
  description: string;
}

interface IncomePageProps {
  incomes: Income[];
  onAddIncome: (income: Income) => void;
  onDeleteIncome: (id: string) => void;
}

export default function IncomePage({ incomes, onAddIncome, onDeleteIncome }: IncomePageProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [frequency, setFrequency] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !source || !date) return;

    const newIncome: Income = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      source,
      frequency: frequency || 'One-time',
      description,
      date
    };
    onAddIncome(newIncome);
    setAmount('');
    setSource('');
    setFrequency('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--financial-success-light)' }}>
          <Wallet className="h-6 w-6" style={{ color: 'var(--financial-success)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--financial-success)' }}>
          Add Income
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card style={{ 
        background: 'var(--card)', 
        borderColor: 'var(--financial-success)',
        color: 'var(--card-foreground)'
      }}>
        <CardHeader style={{ background: 'var(--financial-success-light)' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--financial-success)' }}>
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
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date Received</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Income Source</Label>
                <Select value={source} onValueChange={setSource} required>
                  <SelectTrigger style={{ borderColor: 'var(--border)' }}>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Business">Business Income</SelectItem>
                    <SelectItem value="Investment">Investment Returns</SelectItem>
                    <SelectItem value="Rental">Rental Income</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger style={{ borderColor: 'var(--border)' }}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter income description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              style={{
                background: 'var(--financial-success)',
                color: 'white'
              }}
            >
              Add Income
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE RECEITAS */}
      <Card style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>Recent Incomes</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
              No income yet
            </p>
          ) : (
            <div className="space-y-2">
              {incomes.slice(0, 10).map((income) => (
                <div 
                  key={income.id} 
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    border: `1px solid var(--financial-success-light)`
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                      {income.description || income.source}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--financial-success)' }}>
                      {income.source} • {income.frequency} • {new Date(income.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-bold" style={{ color: 'var(--financial-success)' }}>
                      +${income.amount.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteIncome(income.id)}
                      style={{ color: 'var(--financial-success)' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}