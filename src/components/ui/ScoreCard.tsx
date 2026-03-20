import React from 'react';
import { cn } from '../../lib/utils';

interface ScoreCardProps {
  score: number;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCard({ score, label, className, size = 'md' }: ScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    if (s >= 60) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const sizes = {
    sm: 'p-3 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-6 text-base',
  };

  const circleSizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={cn(
      'flex items-center gap-4 rounded-xl border border-slate-200 bg-white',
      sizes[size],
      className
    )}>
      <div className={cn(
        'rounded-full flex items-center justify-center font-bold border-2 shrink-0',
        circleSizes[size],
        getScoreColor(score)
      )}>
        {score}%
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{label}</h4>
        <p className="text-slate-500 text-xs mt-0.5">Role Readiness Score</p>
      </div>
    </div>
  );
}
