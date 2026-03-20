import React from 'react';
import { Plus, Trash2, Lightbulb } from 'lucide-react';
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
      type: 'priced',
      investmentAmount: 1_000_000,
      preMoneyValuation: 5_000_000,
      optionPoolPercentage: 10,
      valuationCap: 5_000_000,
      discount: 20,
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
    <div className="space-y-8">
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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-lg shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Advisor Tip: The Option Pool Shuffle</h4>
          <p className="text-sm text-amber-800 mt-1">
            In priced rounds, VCs usually require the new employee option pool to come out of the <strong>pre-money</strong> valuation. 
            This means <em>you</em> (the founders) take 100% of the dilution for future employees, not the investors. 
            SAFEs, on the other hand, are simpler and convert later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-3 w-full pr-4">
                <input
                  type="text"
                  value={round.name}
                  onChange={(e) => updateRound(round.id, 'name', e.target.value)}
                  className="text-lg font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5 w-full"
                  placeholder="Round Name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateRound(round.id, 'type', 'priced')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      round.type === 'priced'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                    }`}
                  >
                    Priced Round
                  </button>
                  <button
                    onClick={() => updateRound(round.id, 'type', 'safe')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      round.type === 'safe'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                    }`}
                  >
                    SAFE Note
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeRound(round.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 mt-1 shrink-0"
                title="Remove Round"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
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

              {round.type === 'priced' ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-600 font-medium">
                      Valuation Cap ($)
                    </label>
                    <input
                      type="number"
                      value={round.valuationCap}
                      onChange={(e) =>
                        updateRound(round.id, 'valuationCap', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500">
                      *Estimated conversion at cap for modeling purposes.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
