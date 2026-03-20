import React from 'react';
import * as Icons from 'lucide-react';
import { INDUSTRIES } from '../data/industries';
import { cn } from '../lib/utils';

interface IndustrySelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function IndustrySelector({ selectedId, onSelect }: IndustrySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {INDUSTRIES.map((industry) => {
        const Icon = (Icons as any)[industry.icon];
        const isSelected = selectedId === industry.id;

        return (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={cn(
              'flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all hover:border-indigo-400 hover:bg-indigo-50/30',
              isSelected 
                ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                : 'border-slate-200 bg-white'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors',
              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            )}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <h3 className={cn(
              'font-bold text-lg mb-1',
              isSelected ? 'text-indigo-900' : 'text-slate-900'
            )}>
              {industry.name}
            </h3>
            <p className={cn(
              'text-sm leading-relaxed',
              isSelected ? 'text-indigo-700' : 'text-slate-500'
            )}>
              {industry.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
