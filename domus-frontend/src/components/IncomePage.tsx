import React, { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/card';
import { Plus, Wallet, Trash2 } from 'lucide-react';

interface Income {
  id: string;
  amount: number;
  source: string;
  frequency: string;
  description: string;
  date: string;
}

interface IncomePageProps {
  incomes: Income[];
  onAddIncome: (income: Income) => void;
  onDeleteIncome: (id: string) => void;
}

export default function IncomePage({ incomes, onAddIncome, onDeleteIncome }: IncomePageProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !source || !date) return;

    const newIncome: Income = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      source,
      description,
      date,
      frequency
    };
    onAddIncome(newIncome);
    setAmount('');
    setSource('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setFrequency('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-green-100">
          <Wallet className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-700">Add Income</h1>
      </div>

      <Card className="border-green-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-700">
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
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Income Source</Label>
                <Select value={source} onValueChange={setSource} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Business">Business Income</SelectItem>
                    <SelectItem value="Investment">Investment Returns</SelectItem>
                    <SelectItem value="Rental">Rental Income</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Commission">Commission</SelectItem>
                    <SelectItem value="Pension">Pension</SelectItem>
                    <SelectItem value="Dividend">Dividends</SelectItem>
                    <SelectItem value="Gift">Gift/Inheritance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
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
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Add Income
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-700">Recent Incomes</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No income yet</p>
          ) : (
            <div className="space-y-2">
              {incomes.slice(0, 10).map((income) => (
                <div key={income.id} className="flex justify-between items-center p-3 border border-green-100 rounded-lg bg-green-50/50">
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{income.description || income.source}</div>
                    <div className="text-sm text-green-600">{income.source} • {new Date(income.date).toLocaleDateString()} {income.frequency && `• ${income.frequency}`}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-green-700 font-bold">+${income.amount.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteIncome(income.id)}
                      className="text-green-600 hover:bg-green-100"
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