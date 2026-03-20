import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'indigo' | 'emerald' | 'amber' | 'red' | 'slate';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
