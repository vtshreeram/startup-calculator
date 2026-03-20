import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, PieChart as PieChartIcon, Lock, ShieldAlert } from 'lucide-react';
import { FundingRound } from '../types';
import { FounderSection } from '../components/FounderSection';
import { FundingSection } from '../components/FundingSection';
import { CapTableSection } from '../components/CapTableSection';
import { useEvaluation } from '../contexts/EvaluationContext';

export default function EquityCalculatorPage() {
  const { founders, setFounders, evaluations } = useEvaluation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'founders' | 'funding' | 'cap-table'>('founders');
  const [rounds, setRounds] = useState<FundingRound[]>([]);

  const approvedCount = evaluations.filter(e => e.status === 'approved').length;
  const isTeamApproved = evaluations.length > 0 && approvedCount === evaluations.length;

  const tabs = [
    { id: 'founders', label: 'Co-Founders', icon: Users },
    { id: 'funding', label: 'Funding Rounds', icon: TrendingUp },
    { id: 'cap-table', label: 'Cap Table', icon: PieChartIcon },
  ] as const;

  if (!isTeamApproved) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Team Approval Required</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          The equity calculator is locked until your team composition has been reviewed and approved by AI analysis.
        </p>
        <button 
          onClick={() => navigate('/team')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Go to Team Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-600" />
        <span className="text-sm font-medium text-emerald-800">
          Team approved! You can now customize equity splits based on AI recommendations.
        </span>
      </div>

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
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
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
    </div>
  );
}
