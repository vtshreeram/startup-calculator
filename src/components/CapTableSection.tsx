import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Lightbulb } from 'lucide-react';
import { Founder, FundingRound } from '../types';
import { calculateCapTable } from '../lib/calculations';
import { cn } from '../lib/utils';

interface CapTableSectionProps {
  founders: Founder[];
  rounds: FundingRound[];
}

const COLORS = [
  '#4f46e5', // indigo-600
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#64748b', // slate-500
];

export function CapTableSection({ founders, rounds }: CapTableSectionProps) {
  const capTableHistory = useMemo(
    () => calculateCapTable(founders, rounds),
    [founders, rounds]
  );

  const currentCapTable = capTableHistory[capTableHistory.length - 1];

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);

  const formatPercent = (num: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100);

  if (!currentCapTable) return null;

  // Prepare data for the Paper Value chart
  const paperValueData = capTableHistory.map((history) => {
    const dataPoint: any = { name: history.roundName };
    history.entries.forEach((entry) => {
      if (entry.type === 'founder') {
        dataPoint[entry.name] = entry.paperValue;
      }
    });
    return dataPoint;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Live Cap Table</h2>
          <p className="text-sm text-slate-500 mt-1">
            See exactly how equity is distributed after all funding rounds.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-lg shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Advisor Tip: The Watermelon vs. Grape</h4>
          <p className="text-sm text-amber-800 mt-1">
            Don't obsess over your ownership percentage shrinking. 10% of a $100M watermelon is much better than 100% of a $10k grape. 
            Focus on the <strong>Paper Value</strong> column—if that number is going up, you're making the right decisions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Shareholder</th>
                  <th className="px-6 py-4 text-right">Shares</th>
                  <th className="px-6 py-4 text-right">Ownership</th>
                  <th className="px-6 py-4 text-right">Paper Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCapTable.entries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="font-medium text-slate-900">
                          {entry.name}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            entry.type === 'founder' &&
                              'bg-indigo-100 text-indigo-700',
                            entry.type === 'investor' &&
                              'bg-emerald-100 text-emerald-700',
                            entry.type === 'option_pool' &&
                              'bg-amber-100 text-amber-700'
                          )}
                        >
                          {entry.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      {formatNumber(entry.shares)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatPercent(entry.percentage)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-emerald-600">
                      {entry.paperValue > 0 ? formatCurrency(entry.paperValue) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
                <tr>
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4 text-right font-mono">
                    {formatNumber(currentCapTable.totalShares)}
                  </td>
                  <td className="px-6 py-4 text-right">100.00%</td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-600">
                    {currentCapTable.postMoneyValuation > 0 ? formatCurrency(currentCapTable.postMoneyValuation) : '-'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Ownership Breakdown
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentCapTable.entries}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {currentCapTable.entries.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatPercent(value)}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {rounds.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">
              Round Summary: {currentCapTable.roundName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-indigo-600 font-medium mb-1">
                  Post-Money Valuation
                </p>
                <p className="text-2xl font-bold text-indigo-900">
                  {formatCurrency(currentCapTable.postMoneyValuation)}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium mb-1">
                  Total Shares
                </p>
                <p className="text-2xl font-bold text-indigo-900 font-mono">
                  {formatNumber(currentCapTable.totalShares)}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium mb-1">
                  Share Price
                </p>
                <p className="text-2xl font-bold text-indigo-900 font-mono">
                  {formatCurrency(currentCapTable.sharePrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Founder Paper Value Growth
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paperValueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  {founders.map((founder, idx) => (
                    <Bar 
                      key={founder.id} 
                      dataKey={founder.name} 
                      fill={COLORS[idx % COLORS.length]} 
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
