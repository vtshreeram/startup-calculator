import React from 'react';
import { SupportRequirement } from '../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SupportRequirementsProps {
  requirements: SupportRequirement[];
  onChange: (requirements: SupportRequirement[]) => void;
}

export function SupportRequirements({ requirements, onChange }: SupportRequirementsProps) {
  const addRequirement = () => {
    const newReq: SupportRequirement = {
      type: 'Technical',
      description: '',
      isCritical: false,
    };
    onChange([...requirements, newReq]);
  };

  const removeRequirement = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, updates: Partial<SupportRequirement>) => {
    onChange(requirements.map((r, i) => i === index ? { ...r, ...updates } : r));
  };

  const types = ['Technical', 'Financial', 'Human Resources', 'Advisory', 'Other'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Support & Resource Needs
        </h3>
        <button
          onClick={addRequirement}
          type="button"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Need
        </button>
      </div>

      <div className="space-y-3">
        {requirements.map((req, index) => (
          <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex gap-4 items-center">
                  <select
                    value={req.type}
                    onChange={(e) => updateRequirement(index, { type: e.target.value })}
                    className="text-xs font-bold text-slate-900 border border-slate-200 bg-slate-50 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  
                  <button
                    type="button"
                    onClick={() => updateRequirement(index, { isCritical: !req.isCritical })}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                      req.isCritical 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    )}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Critical Dependency
                  </button>
                </div>

                <textarea
                  value={req.description}
                  onChange={(e) => updateRequirement(index, { description: e.target.value })}
                  placeholder="Describe what resources or support you need to succeed in this role."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[60px]"
                />
              </div>

              <button
                onClick={() => removeRequirement(index)}
                type="button"
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
