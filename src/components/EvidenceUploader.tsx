import React from 'react';
import { Evidence } from '../types';
import { Plus, Trash2, Link as LinkIcon, FileText } from 'lucide-react';

interface EvidenceUploaderProps {
  evidence: Evidence[];
  onChange: (evidence: Evidence[]) => void;
}

export function EvidenceUploader({ evidence, onChange }: EvidenceUploaderProps) {
  const addEvidence = () => {
    const newEv: Evidence = {
      type: 'Link',
      value: '',
    };
    onChange([...evidence, newEv]);
  };

  const removeEvidence = (index: number) => {
    onChange(evidence.filter((_, i) => i !== index));
  };

  const updateEvidence = (index: number, updates: Partial<Evidence>) => {
    onChange(evidence.map((ev, i) => i === index ? { ...ev, ...updates } : ev));
  };

  const types: Evidence['type'][] = ['Link', 'Description', 'File'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Evidence & Proof of Work
        </h3>
        <button
          onClick={addEvidence}
          type="button"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Proof
        </button>
      </div>

      <div className="space-y-3">
        {evidence.map((ev, index) => (
          <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex gap-4 items-center">
              <select
                value={ev.type}
                onChange={(e) => updateEvidence(index, { type: e.target.value as Evidence['type'] })}
                className="text-xs font-bold text-slate-900 border border-slate-200 bg-slate-50 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                {ev.type === 'Link' ? <LinkIcon className="w-4 h-4 text-slate-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                <input
                  type="text"
                  value={ev.value}
                  onChange={(e) => updateEvidence(index, { value: e.target.value })}
                  placeholder={ev.type === 'Link' ? 'https://github.com/...' : 'Describe previous project or attach doc...'}
                  className="flex-1 text-xs bg-transparent border-none focus:ring-0 p-0"
                />
              </div>

              <button
                onClick={() => removeEvidence(index)}
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
