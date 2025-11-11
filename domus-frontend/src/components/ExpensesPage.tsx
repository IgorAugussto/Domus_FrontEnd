import { useState } from 'react';
import { Button } from '../ui-components/button';
import { Input } from '../ui-components/input';
import { Label } from '../ui-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui-components/select';
import { Textarea } from '../ui-components/textArea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/Card';
import { Plus, DollarSign } from 'lucide-react';

export function ExpensesPage() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock expense addition
    console.log('Adding expense:', { amount, category, description, date });
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-red-100">
          <DollarSign className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-red-700">Add Expense</h1>
      </div>

      <Card className="border-red-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
          <CardTitle className="flex items-center gap-2 text-red-700">
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

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="bills">Bills & Utilities</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Expenses Preview */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-orange-700">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border border-red-100 rounded-lg bg-red-50/50">
              <div>
                <div className="text-gray-900">Lunch at Restaurant</div>
                <div className="text-sm text-red-600">Food & Dining • Today</div>
              </div>
              <div className="text-red-700 font-medium">-$25.50</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-red-100 rounded-lg bg-red-50/50">
              <div>
                <div className="text-gray-900">Gas Station</div>
                <div className="text-sm text-red-600">Transportation • Yesterday</div>
              </div>
              <div className="text-red-700 font-medium">-$45.00</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-red-100 rounded-lg bg-red-50/50">
              <div>
                <div className="text-gray-900">Grocery Shopping</div>
                <div className="text-sm text-red-600">Food & Dining • 2 days ago</div>
              </div>
              <div className="text-red-700 font-medium">-$87.30</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}