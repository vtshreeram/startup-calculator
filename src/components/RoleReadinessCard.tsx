import React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RoleReadinessCardProps {
  founderName: string;
  role: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  suggestedEquityRange?: { min: number; max: number };
  status: 'pending' | 'approved' | 'rejected';
  onApprove?: () => void;
  onReject?: () => void;
  onRerun?: () => void;
}

export function RoleReadinessCard({
  founderName,
  role,
  score,
  strengths,
  gaps,
  recommendations,
  suggestedEquityRange,
  status,
  onApprove,
  onReject,
  onRerun,
}: RoleReadinessCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4',
              getScoreColor(score)
            )}>
              {score}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{founderName}</h3>
              <p className="text-slate-500 font-medium">{role}</p>
              <div className="mt-2">
                {status === 'approved' && <Badge variant="emerald">Approved</Badge>}
                {status === 'rejected' && <Badge variant="red">Rejected</Badge>}
                {status === 'pending' && <Badge variant="amber">Pending Review</Badge>}
              </div>
            </div>
          </div>
        </div>

        {suggestedEquityRange && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-sm font-bold text-indigo-800">Suggested Equity Range</p>
            <p className="text-2xl font-bold text-indigo-600">
              {suggestedEquityRange.min}% - {suggestedEquityRange.max}%
            </p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Gaps & Risks
            </h4>
            <ul className="space-y-2">
              {gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {recommendations.map((r, i) => (
                <li key={i} className="text-sm text-slate-600 pl-6 relative">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {status === 'pending' && (
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold border border-red-200 hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
