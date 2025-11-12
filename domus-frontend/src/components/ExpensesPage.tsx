// src/components/ExpensesPage.tsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from "../ui-components/card";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui-components/select";
import { Textarea } from "../ui-components/textArea";
import { DollarSign, Plus, Trash2 } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface ExpensesPageProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpensesPage({ expenses, onAddExpense, onDeleteExpense }: ExpensesPageProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!amount || !category || !date) return;

  const newExpense: Expense = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    category,
    description,
    date
  };
  onAddExpense(newExpense);
  setAmount('');
  setCategory('');
  setDescription('');
  setDate(new Date().toISOString().split('T')[0]); // ← CORRIGIDO!
};

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--financial-danger-light)' }}>
          <DollarSign className="h-6 w-6" style={{ color: 'var(--financial-danger)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--financial-danger)' }}>
          Add Expense
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card style={{ 
        background: 'var(--card)', 
        borderColor: 'var(--financial-danger)',
        color: 'var(--card-foreground)'
      }}>
        <CardHeader style={{ background: 'var(--financial-danger-light)' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--financial-danger)' }}>
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
                  style={{ borderColor: 'var(--border)' }}
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
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger style={{ borderColor: 'var(--border)' }}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
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
                background: 'var(--financial-danger)',
                color: 'white'
              }}
            >
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE DESPESAS */}
      <Card style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
              No expenses yet
            </p>
          ) : (
            <div className="space-y-2">
              {expenses.slice(0, 10).map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    border: `1px solid var(--financial-danger-light)`
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                      {expense.description || 'Expense'}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--financial-danger)' }}>
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-bold" style={{ color: 'var(--financial-danger)' }}>
                      -${expense.amount.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteExpense(expense.id)}
                      style={{ color: 'var(--financial-danger)' }}
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