import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FundingRound } from '../types';

interface FundingSectionProps {
  rounds: FundingRound[];
  setRounds: React.Dispatch<React.SetStateAction<FundingRound[]>>;
}

export function FundingSection({ rounds, setRounds }: FundingSectionProps) {
  const addRound = () => {
    const newRound: FundingRound = {
      id: crypto.randomUUID(),
      name: `Round ${rounds.length + 1}`,
      preMoneyValuation: 5_000_000,
      investmentAmount: 1_000_000,
      optionPoolPercentage: 10,
    };
    setRounds([...rounds, newRound]);
  };

  const removeRound = (id: string) => {
    setRounds(rounds.filter((r) => r.id !== id));
  };

  const updateRound = (id: string, field: keyof FundingRound, value: string | number) => {
    setRounds(
      rounds.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Funding Rounds</h2>
          <p className="text-sm text-slate-500 mt-1">
            Model future funding rounds to see how your equity dilutes.
          </p>
        </div>
        <button
          onClick={addRound}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Round
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                value={round.name}
                onChange={(e) => updateRound(round.id, 'name', e.target.value)}
                className="text-lg font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5"
                placeholder="Round Name"
              />
              <button
                onClick={() => removeRound(round.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Remove Round"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-600 font-medium">
                  Pre-Money Valuation ($)
                </label>
                <input
                  type="number"
                  value={round.preMoneyValuation}
                  onChange={(e) =>
                    updateRound(round.id, 'preMoneyValuation', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-slate-600 font-medium">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={round.investmentAmount}
                  onChange={(e) =>
                    updateRound(round.id, 'investmentAmount', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-slate-600 font-medium">
                  New Option Pool (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={round.optionPoolPercentage}
                    onChange={(e) =>
                      updateRound(round.id, 'optionPoolPercentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-sm text-slate-900 font-semibold w-12 text-right">
                    {round.optionPoolPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
