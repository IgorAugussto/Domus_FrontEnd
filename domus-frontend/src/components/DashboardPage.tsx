import { Card, CardContent, CardHeader, CardTitle } from '../ui-components/Card';
import { Progress } from '../ui-components/Progress';
import { PieChart, AreaChart, Cell, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Target, AlertCircle } from 'lucide-react';

// Mock data - in real app this would come from your data store
const mockData = {
  totalIncome: 5475.50,
  totalExpenses: 1157.80,
  totalInvestments: 8500.00,
  investmentGains: 485.75,
  netWorth: 12803.45
};

const monthlyData = [
  { month: 'Jan', income: 4500, expenses: 1200, investments: 1000 },
  { month: 'Feb', income: 4500, expenses: 1100, investments: 1500 },
  { month: 'Mar', income: 4800, expenses: 1300, investments: 800 },
  { month: 'Apr', income: 4500, expenses: 1050, investments: 1200 },
  { month: 'May', income: 5200, expenses: 1400, investments: 900 },
  { month: 'Jun', income: 5475, expenses: 1158, investments: 2000 }
];

const expenseCategories = [
  { name: 'Food & Dining', value: 450, color: '#ef4444' },
  { name: 'Transportation', value: 320, color: '#f97316' },
  { name: 'Shopping', value: 250, color: '#eab308' },
  { name: 'Entertainment', value: 137, color: '#22c55e' }
];

const investmentPortfolio = [
  { name: 'Stocks', value: 45, color: '#3b82f6' },
  { name: 'Bonds', value: 25, color: '#8b5cf6' },
  { name: 'ETFs', value: 20, color: '#06b6d4' },
  { name: 'Crypto', value: 10, color: '#f59e0b' }
];

export function DashboardPage() {
  const netIncome = mockData.totalIncome - mockData.totalExpenses;
  const totalPortfolioValue = mockData.totalInvestments + mockData.investmentGains;
  const savingsRate = ((netIncome / mockData.totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-blue-100">
          <Target className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-blue-700">Financial Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-sm text-green-700">Total Income</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-green-700">
              ${mockData.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="text-sm text-red-700">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-red-700">
              ${mockData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-red-600 mt-1">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardTitle className="text-sm text-amber-700">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-amber-700">
              ${totalPortfolioValue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5.7% returns
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm text-blue-700">Net Worth</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-blue-700">
              ${mockData.netWorth.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Savings Rate: {savingsRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Monthly Financial Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="investments" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: $${entry.value}`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Savings Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Emergency Fund</span>
                <span className="text-sm">$8,000 / $10,000</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Vacation Fund</span>
                <span className="text-sm">$2,400 / $5,000</span>
              </div>
              <Progress value={48} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Investment Goal</span>
                <span className="text-sm">$8,500 / $15,000</span>
              </div>
              <Progress value={57} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Investment Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Investment Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={investmentPortfolio}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {investmentPortfolio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="text-amber-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              <strong>Great job!</strong> Your savings rate of {savingsRate}% is above the recommended 20%.
            </p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <strong>Investment Performance:</strong> Your portfolio has gained ${mockData.investmentGains.toLocaleString()} (+5.7%) this period.
            </p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              <strong>Recommendation:</strong> Consider increasing your emergency fund to reach the $10,000 goal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}