// src/components/InvestmentsPage.tsx
import React, { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/card';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';

interface Investment {
  id: string;
  amount: number;
  type: string;
  expectedReturn: number;
  description: string;
  date: string;
}

interface InvestmentsPageProps {
  investments: Investment[];
  onAddInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export default function InvestmentsPage({ investments, onAddInvestment, onDeleteInvestment }: InvestmentsPageProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !type || !expectedReturn || !date) return;

    const newInvestment: Investment = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      expectedReturn: parseFloat(expectedReturn),
      description,
      date
    };
    onAddInvestment(newInvestment);
    setAmount('');
    setType('');
    setExpectedReturn('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--financial-investment-light)' }}>
          <TrendingUp className="h-6 w-6" style={{ color: 'var(--financial-investment)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--financial-investment)' }}>
          Add Investment
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <Card style={{ 
        background: 'var(--card)', 
        borderColor: 'var(--financial-investment)',
        color: 'var(--card-foreground)'
      }}>
        <CardHeader style={{ background: 'var(--financial-investment-light)' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--financial-investment)' }}>
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
                <Label htmlFor="type">Investment Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger style={{ borderColor: 'var(--border)' }}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Bonds">Bonds</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                    <SelectItem value="ETF">ETF</SelectItem>
                    <SelectItem value="Savings">Savings Account</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                  style={{ borderColor: 'var(--border)' }}
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
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              style={{
                background: 'var(--financial-investment)',
                color: 'white'
              }}
            >
              Add Investment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE INVESTIMENTOS */}
      <Card style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
              No investments yet
            </p>
          ) : (
            <div className="space-y-2">
              {investments.slice(0, 10).map((investment) => (
                <div 
                  key={investment.id} 
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    border: `1px solid var(--financial-investment-light)`
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                      {investment.description || investment.type}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--financial-investment)' }}>
                      {investment.type} • {new Date(investment.date).toLocaleDateString()} • {investment.expectedReturn}% return
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-bold" style={{ color: 'var(--financial-investment)' }}>
                      ${investment.amount.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteInvestment(investment.id)}
                      style={{ color: 'var(--financial-investment)' }}
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