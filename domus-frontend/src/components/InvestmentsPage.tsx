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
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-amber-100">
          <TrendingUp className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-amber-700">Add Investment</h1>
      </div>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="flex items-center gap-2 text-amber-700">
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
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Investment Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
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
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            >
              Add Investment
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardTitle className="text-yellow-700">Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No investments yet</p>
          ) : (
            <div className="space-y-2">
              {investments.slice(0, 10).map((investment) => (
                <div key={investment.id} className="flex justify-between items-center p-3 border border-amber-100 rounded-lg bg-amber-50/50">
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{investment.description || investment.type}</div>
                    <div className="text-sm text-amber-600">{investment.type} • {new Date(investment.date).toLocaleDateString()} • {investment.expectedReturn}% return</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-amber-700 font-bold">${investment.amount.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteInvestment(investment.id)}
                      className="text-amber-600 hover:bg-amber-100"
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