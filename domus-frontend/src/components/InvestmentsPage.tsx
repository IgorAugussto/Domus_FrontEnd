import { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/Card';
import { Plus, TrendingUp } from 'lucide-react';

export function InvestmentsPage() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturn, setExpectedReturn] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock investment addition
    console.log('Adding investment:', { amount, type, description, date, expectedReturn });
    // Reset form
    setAmount('');
    setType('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setExpectedReturn('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-amber-100">
          <TrendingUp className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-amber-700">Add Investment</h1>
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
                <Label htmlFor="amount">Amount Invested</Label>
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
                <Label htmlFor="date">Investment Date</Label>
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
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="bonds">Bonds</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="index-fund">Index Fund</SelectItem>
                    <SelectItem value="retirement">Retirement Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter investment details (e.g., ticker symbol, fund name)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
              Add Investment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Investments Preview */}
      <Card className="border-yellow-200">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardTitle className="text-yellow-700">Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border border-amber-100 rounded-lg bg-amber-50/50">
              <div>
                <div className="text-gray-900">S&P 500 Index Fund</div>
                <div className="text-sm text-amber-600">ETF • 7.5% expected return • Today</div>
              </div>
              <div className="text-amber-700 font-medium">$2,000.00</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-amber-100 rounded-lg bg-amber-50/50">
              <div>
                <div className="text-gray-900">Tech Stocks Portfolio</div>
                <div className="text-sm text-amber-600">Stocks • 12% expected return • 2 days ago</div>
              </div>
              <div className="text-amber-700 font-medium">$1,500.00</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-amber-100 rounded-lg bg-amber-50/50">
              <div>
                <div className="text-gray-900">Government Bonds</div>
                <div className="text-sm text-amber-600">Bonds • 4.2% expected return • 1 week ago</div>
              </div>
              <div className="text-amber-700 font-medium">$5,000.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
