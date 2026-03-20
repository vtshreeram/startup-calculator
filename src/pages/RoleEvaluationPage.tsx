import React, { useState } from 'react';
import { useEvaluation } from '../contexts/EvaluationContext';
import { EvaluationFlow } from '../components/EvaluationFlow';
import { RoleEvaluation, Founder } from '../types';
import { CheckCircle2, ClipboardList, ArrowRight } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

export default function RoleEvaluationPage() {
  const { founders, startup, evaluations, updateEvaluation } = useEvaluation();
  const [evaluatingFounder, setEvaluatingFounder] = useState<Founder | null>(null);
  const navigate = useNavigate();

  if (!startup) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Startup Profile First</h3>
        <p className="text-slate-500 mb-6">You need to define your industry and stage before evaluating roles.</p>
        <button 
          onClick={() => navigate('/startup')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  const handleSave = (evaluation: RoleEvaluation) => {
    updateEvaluation(evaluation);
    setEvaluatingFounder(null);
  };

  const allCompleted = founders.length > 0 && evaluations.length === founders.length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Role Evaluations</h2>
          <p className="text-slate-500">Evaluate each team member's role and responsibilities</p>
        </div>
      </div>

      {evaluatingFounder ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10">
          <EvaluationFlow
            founder={evaluatingFounder}
            industryId={startup.industry}
            initialEvaluation={evaluations.find(e => e.founderId === evaluatingFounder.id) || null}
            onSave={handleSave}
            onCancel={() => setEvaluatingFounder(null)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {founders.map((founder) => {
            const evaluation = evaluations.find(e => e.founderId === founder.id);
            const isComplete = !!evaluation && evaluation.personaId !== '';

            return (
              <div key={founder.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                      {founder.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{founder.name}</h3>
                      <p className="text-sm text-slate-500">{founder.role}</p>
                    </div>
                  </div>
                  {isComplete ? (
                    <Badge variant="emerald"><CheckCircle2 className="w-3 h-3" /> Complete</Badge>
                  ) : (
                    <Badge variant="amber">Pending</Badge>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isComplete 
                      ? "Role evaluation complete. Ready for AI gap analysis."
                      : "Evaluate this founder's specific responsibilities and authority levels."}
                  </p>
                </div>

                <button
                  onClick={() => setEvaluatingFounder(founder)}
                  className={`
                    w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                    ${isComplete 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}
                  `}
                >
                  <ClipboardList className="w-4 h-4" />
                  {isComplete ? 'Edit Evaluation' : 'Start Evaluation'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!evaluatingFounder && allCompleted && (
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => navigate('/team')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            Submit for AI Team Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
