import React, { useMemo } from 'react';
import { Plus, Trash2, Lightbulb, ShieldCheck } from 'lucide-react';
import { Founder, FACTOR_LABELS, FACTOR_WEIGHTS } from '../types';

interface FounderSectionProps {
  founders: Founder[];
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
}

export function FounderSection({ founders, setFounders }: FounderSectionProps) {
  const addFounder = () => {
    const newFounder: Founder = {
      id: crypto.randomUUID(),
      name: `Founder ${founders.length + 1}`,
      role: 'Co-Founder',
      factors: {
        idea: 5,
        skills: 5,
        time: 5,
        capital: 5,
        network: 5,
        risk: 5,
      },
    };
    setFounders([...founders, newFounder]);
  };

  const removeFounder = (id: string) => {
    setFounders(founders.filter((f) => f.id !== id));
  };

  const updateFounderField = (id: string, field: keyof Founder, value: string) => {
    setFounders(founders.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const updateFounderFactor = (
    id: string,
    factor: keyof Founder['factors'],
    value: number
  ) => {
    setFounders(
      founders.map((f) =>
        f.id === id ? { ...f, factors: { ...f.factors, [factor]: value } } : f
      )
    );
  };

  const founderPercentages = useMemo(() => {
    let totalScore = 0;
    const scores = founders.map((founder) => {
      let score = 0;
      (Object.keys(FACTOR_WEIGHTS) as Array<keyof typeof FACTOR_WEIGHTS>).forEach(
        (factor) => {
          score += founder.factors[factor] * FACTOR_WEIGHTS[factor];
        }
      );
      totalScore += score;
      return { id: founder.id, score };
    });

    return scores.reduce((acc, { id, score }) => {
      acc[id] = totalScore > 0 ? (score / totalScore) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);
  }, [founders]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Co-Founders</h2>
          <p className="text-sm text-slate-500 mt-1">
            Rate each founder's contribution (1-10) to calculate fair equity splits.
          </p>
        </div>
        <button
          onClick={addFounder}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Founder
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-lg shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Advisor Tip: Avoid the 50/50 Trap</h4>
          <p className="text-sm text-amber-800 mt-1">
            Never split equity evenly just to avoid a hard conversation. Ideas are cheap; execution is everything. 
            Use the sliders below to objectively weigh who is bringing what to the table. Also, <strong>always</strong> use a 4-year vesting schedule with a 1-year cliff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {founders.map((founder) => (
          <div
            key={founder.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-indigo-50 px-4 py-2 rounded-bl-xl border-b border-l border-indigo-100">
              <span className="text-lg font-bold text-indigo-700">
                {founderPercentages[founder.id].toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-start justify-between mb-6 pr-16">
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => updateFounderField(founder.id, 'name', e.target.value)}
                  className="text-lg font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5 w-full"
                  placeholder="Founder Name"
                />
                <input
                  type="text"
                  value={founder.role}
                  onChange={(e) => updateFounderField(founder.id, 'role', e.target.value)}
                  className="text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5 w-full"
                  placeholder="Role (e.g., CEO, CTO)"
                />
              </div>
              {founders.length > 1 && (
                <button
                  onClick={() => removeFounder(founder.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0 mt-1"
                  title="Remove Founder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              Standard 4-Year Vesting, 1-Year Cliff Applied
            </div>

            <div className="space-y-4">
              {(Object.keys(FACTOR_LABELS) as Array<keyof typeof FACTOR_LABELS>).map(
                (factor) => (
                  <div key={factor} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">
                        {FACTOR_LABELS[factor]}
                      </span>
                      <span className="text-slate-900 font-semibold">
                        {founder.factors[factor]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={founder.factors[factor]}
                        onChange={(e) =>
                          updateFounderFactor(founder.id, factor, parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-xs text-slate-400 font-mono w-12 text-right">
                        x{FACTOR_WEIGHTS[factor]}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
