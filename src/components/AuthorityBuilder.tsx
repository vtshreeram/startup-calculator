import React from 'react';
import { AuthorityRequest } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthorityBuilderProps {
  authorities: AuthorityRequest[];
  onChange: (authorities: AuthorityRequest[]) => void;
}

export function AuthorityBuilder({ authorities, onChange }: AuthorityBuilderProps) {
  const addAuthority = () => {
    const newAuth: AuthorityRequest = {
      domain: 'Engineering',
      scope: 'Operational',
      reasoning: '',
    };
    onChange([...authorities, newAuth]);
  };

  const removeAuthority = (index: number) => {
    onChange(authorities.filter((_, i) => i !== index));
  };

  const updateAuthority = (index: number, updates: Partial<AuthorityRequest>) => {
    onChange(authorities.map((a, i) => i === index ? { ...a, ...updates } : a));
  };

  const scopes: AuthorityRequest['scope'][] = ['Advisory', 'Operational', 'Decision-Maker', 'Full Autonomy'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Decision-Making Authority
        </h3>
        <button
          onClick={addAuthority}
          type="button"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Domain
        </button>
      </div>

      <div className="space-y-3">
        {authorities.map((auth, index) => (
          <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  value={auth.domain}
                  onChange={(e) => updateAuthority(index, { domain: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-900 border-none bg-transparent focus:ring-0 p-0 hover:bg-slate-50 rounded"
                  placeholder="Domain (e.g. Finance, Tech Architecture)"
                />
                
                <div className="flex flex-wrap gap-2">
                  {scopes.map((scope) => {
                    const isActive = auth.scope === scope;
                    return (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => updateAuthority(index, { scope })}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all',
                          isActive 
                            ? 'border-indigo-600 bg-indigo-600 text-white' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                        )}
                      >
                        {scope}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={auth.reasoning}
                  onChange={(e) => updateAuthority(index, { reasoning: e.target.value })}
                  placeholder="Why do you need this authority?"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[60px]"
                />
              </div>

              <button
                onClick={() => removeAuthority(index)}
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
