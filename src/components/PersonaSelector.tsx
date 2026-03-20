import React from 'react';
import { PERSONAS } from '../data/personas';
import { Persona } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface PersonaSelectorProps {
  industryId: string;
  selectedId: string | null;
  onSelect: (persona: Persona) => void;
}

export function PersonaSelector({ industryId, selectedId, onSelect }: PersonaSelectorProps) {
  const filteredPersonas = PERSONAS.filter(p => p.industryId === industryId);

  if (filteredPersonas.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500">No specific role templates found for this industry. You can define a custom role.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredPersonas.map((persona) => {
        const isSelected = selectedId === persona.id;

        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona)}
            className={cn(
              'flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all',
              isSelected 
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            )}
          >
            <div className="flex justify-between w-full items-start mb-2">
              <h3 className="font-bold text-lg text-slate-900">{persona.role}</h3>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
            </div>
            <p className="text-sm text-slate-500 mb-4">{persona.description}</p>
            <div className="flex flex-wrap gap-2">
              {persona.typicalResponsibilities.map((resp, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wider">
                  {resp}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
