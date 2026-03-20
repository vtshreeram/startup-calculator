import React from 'react';
import { ResponsibilityCommitment } from '../types';
import { Trash2, Plus, Clock } from 'lucide-react';

interface ResponsibilityMatrixProps {
  responsibilities: ResponsibilityCommitment[];
  onChange: (responsibilities: ResponsibilityCommitment[]) => void;
}

export function ResponsibilityMatrix({ responsibilities, onChange }: ResponsibilityMatrixProps) {
  const addResponsibility = () => {
    const newResp: ResponsibilityCommitment = {
      id: crypto.randomUUID(),
      label: 'New Responsibility',
      commitmentLevel: 3,
      hoursPerWeek: 10,
    };
    onChange([...responsibilities, newResp]);
  };

  const removeResponsibility = (id: string) => {
    onChange(responsibilities.filter(r => r.id !== id));
  };

  const updateResponsibility = (id: string, updates: Partial<ResponsibilityCommitment>) => {
    onChange(responsibilities.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Responsibilities & Commitment
        </h3>
        <button
          onClick={addResponsibility}
          type="button"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {responsibilities.map((resp) => (
          <div key={resp.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={resp.label}
                  onChange={(e) => updateResponsibility(resp.id, { label: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-900 border-none bg-transparent focus:ring-0 p-0 hover:bg-slate-50 rounded"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>Importance</span>
                      <span>{resp.commitmentLevel}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={resp.commitmentLevel}
                      onChange={(e) => updateResponsibility(resp.id, { commitmentLevel: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time/Week</span>
                      <span>{resp.hoursPerWeek}h</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="80"
                      step="1"
                      value={resp.hoursPerWeek}
                      onChange={(e) => updateResponsibility(resp.id, { hoursPerWeek: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeResponsibility(resp.id)}
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
