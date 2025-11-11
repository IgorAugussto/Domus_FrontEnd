import { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/Card';
import { Plus, Wallet } from 'lucide-react';

export function IncomePage() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock income addition
    console.log('Adding income:', { amount, source, description, date, frequency });
    // Reset form
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
        <h1 className="text-green-700">Add Income</h1>
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
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business Income</SelectItem>
                    <SelectItem value="investment">Investment Returns</SelectItem>
                    <SelectItem value="rental">Rental Income</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="pension">Pension</SelectItem>
                    <SelectItem value="dividend">Dividends</SelectItem>
                    <SelectItem value="gift">Gift/Inheritance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter income description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Add Income
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Income Preview */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="text-emerald-700">Recent Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border border-green-100 rounded-lg bg-green-50/50">
              <div>
                <div className="text-gray-900">Monthly Salary</div>
                <div className="text-sm text-green-600">Salary • Monthly • Today</div>
              </div>
              <div className="text-green-700 font-medium">+$4,500.00</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-green-100 rounded-lg bg-green-50/50">
              <div>
                <div className="text-gray-900">Freelance Project</div>
                <div className="text-sm text-green-600">Freelance • One-time • 3 days ago</div>
              </div>
              <div className="text-green-700 font-medium">+$850.00</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-green-100 rounded-lg bg-green-50/50">
              <div>
                <div className="text-gray-900">Stock Dividends</div>
                <div className="text-sm text-green-600">Investment Returns • Quarterly • 1 week ago</div>
              </div>
              <div className="text-green-700 font-medium">+$125.50</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}