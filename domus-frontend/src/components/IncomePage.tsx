// src/components/IncomePage.tsx
import React, { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-components/card';
import { Plus, Wallet } from 'lucide-react';
import { incomeService } from "../service/incomeService";

export default function IncomePage() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!amount || !category || !source || !date) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    await incomeService.create({
    description: description || `${source} - ${category}`,
    amount: Number(amount),
    date,
    category,
    source
});


    alert("Income salvo com sucesso!");

    // Limpa o formulário
    setAmount('');
    setCategory('');
    setSource('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);

  } catch (error) {
    console.error("Erro ao salvar income:", error);
    alert("Erro ao salvar renda. Tente novamente.");
  }
};



  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--financial-income-light)' }}>
          <Wallet className="h-6 w-6" style={{ color: 'var(--financial-income)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--financial-income)' }}>
          Add Income
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card 
        style={{ 
          background: 'var(--card)', 
          borderColor: 'var(--financial-income)', 
          color: 'var(--card-foreground)' 
        }}
      >
        <CardHeader style={{ background: 'var(--financial-income-light)' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--financial-income)' }}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger style={{ borderColor: 'var(--border)' }}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Investment">Investment Returns</SelectItem>
                    <SelectItem value="Gift">Gift</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="Company / Client / Bank"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                  style={{ borderColor: 'var(--border)' }}
                />
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
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              style={{ background: 'var(--financial-income)', color: 'white' }}>
              Add Income
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE INCOME */}
      <Card style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>Recent Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
            No income added yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
