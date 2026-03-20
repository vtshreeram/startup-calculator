import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ChevronRight, Users, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { Founder, FundingRound } from './types';
import { FounderSection } from './components/FounderSection';
import { FundingSection } from './components/FundingSection';
import { CapTableSection } from './components/CapTableSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'founders' | 'funding' | 'cap-table'>('founders');

  const [founders, setFounders] = useState<Founder[]>([
    {
      id: '1',
      name: 'Founder 1',
      factors: { idea: 8, skills: 7, time: 10, capital: 5, network: 6, risk: 8 },
    },
    {
      id: '2',
      name: 'Founder 2',
      factors: { idea: 3, skills: 9, time: 10, capital: 2, network: 4, risk: 8 },
    },
  ]);

  const [rounds, setRounds] = useState<FundingRound[]>([]);

  const tabs = [
    { id: 'founders', label: 'Co-Founders', icon: Users },
    { id: 'funding', label: 'Funding Rounds', icon: TrendingUp },
    { id: 'cap-table', label: 'Cap Table', icon: PieChartIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Startup Equity Calculator
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Calculate Splits</span>
            <ChevronRight className="w-4 h-4" />
            <span>Model Rounds</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-indigo-600">View Cap Table</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 overflow-x-auto pb-2">
          <nav className="flex space-x-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10"
        >
          {activeTab === 'founders' && (
            <FounderSection founders={founders} setFounders={setFounders} />
          )}
          {activeTab === 'funding' && (
            <FundingSection rounds={rounds} setRounds={setRounds} />
          )}
          {activeTab === 'cap-table' && (
            <CapTableSection founders={founders} rounds={rounds} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
