import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvaluation } from '../contexts/EvaluationContext';
import { TeamCompositionView } from '../components/TeamCompositionView';
import { RoleReadinessCard } from '../components/RoleReadinessCard';
import { evaluateRole, evaluateTeam, updateEvaluationStatus } from '../lib/api';
import { Loader2, AlertTriangle } from 'lucide-react';

interface EvaluationResult {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  suggestedEquityRange?: { min: number; max: number };
}

interface TeamAnalysis {
  overallScore: number;
  overlaps: any[];
  missingRoles: any[];
  authorityGaps: any[];
  recommendations: string[];
}

export default function TeamCompositionPage() {
  const { startup, evaluations, updateEvaluation, founders } = useEvaluation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamAnalysis, setTeamAnalysis] = useState<TeamAnalysis | null>(null);
  const [roleResults, setRoleResults] = useState<Record<string, EvaluationResult>>({});

  useEffect(() => {
    if (evaluations.length > 0) {
      const results: Record<string, EvaluationResult> = {};
      evaluations.forEach(ev => {
        if (ev.aiFeedback) {
          try {
            results[ev.founderId] = JSON.parse(ev.aiFeedback);
          } catch {}
        }
      });
      setRoleResults(results);
    }
  }, [evaluations]);

  const runRoleEvaluations = async () => {
    if (!startup) return;
    
    setLoading(true);
    setError(null);

    try {
      for (const evaluation of evaluations) {
        // Ensure at least one responsibility exists
        const evalWithResponsibility = {
          ...evaluation,
          responsibilities: evaluation.responsibilities.length > 0 
            ? evaluation.responsibilities 
            : [{ id: '1', label: 'General responsibilities', commitmentLevel: 3, hoursPerWeek: 40 }],
          authorities: evaluation.authorities.length > 0 
            ? evaluation.authorities 
            : [{ domain: 'Operations', scope: 'Operational' as const, reasoning: 'Default authority' }],
        };
        
        const result = await evaluateRole(
          evalWithResponsibility,
          startup.industry,
          startup.stage
        );
        
        const updated = {
          ...evaluation,
          score: result.score,
          aiFeedback: JSON.stringify(result),
          status: 'pending' as const,
        };
        
        updateEvaluation(updated);
        setRoleResults(prev => ({ ...prev, [evaluation.founderId]: result }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run evaluations');
    } finally {
      setLoading(false);
    }
  };

  const runTeamAnalysis = async () => {
    if (!startup) return;
    
    setLoading(true);
    setError(null);

    try {
      // Ensure evaluations have required data
      const evalsWithDefaults = evaluations.map(ev => ({
        ...ev,
        responsibilities: ev.responsibilities.length > 0 
          ? ev.responsibilities 
          : [{ id: '1', label: 'General responsibilities', commitmentLevel: 3, hoursPerWeek: 40 }],
        authorities: ev.authorities.length > 0 
          ? ev.authorities 
          : [{ domain: 'Operations', scope: 'Operational' as const, reasoning: 'Default authority' }],
      }));
      
      const result = await evaluateTeam(
        evalsWithDefaults,
        startup.industry,
        startup.stage
      );
      setTeamAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze team');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRole = (evaluationId: string) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    if (evaluation) {
      updateEvaluation({ ...evaluation, status: 'approved' });
    }
  };

  const handleRejectRole = (evaluationId: string) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    if (evaluation) {
      updateEvaluation({ ...evaluation, status: 'rejected' });
    }
  };

  const handleApproveTeam = () => {
    evaluations.forEach(ev => {
      if (ev.status === 'pending') {
        updateEvaluation({ ...ev, status: 'approved' });
      }
    });
    navigate('/equity');
  };

  if (!startup) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Startup Profile First</h3>
        <p className="text-slate-500 mb-6">You need to define your industry and stage before reviewing the team.</p>
        <button 
          onClick={() => navigate('/startup')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  const pendingEvals = evaluations.filter(e => e.status === 'pending');
  const approvedCount = evaluations.filter(e => e.status === 'approved').length;
  const isTeamApproved = evaluations.length > 0 && approvedCount === evaluations.length;

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Analyzing team composition...</p>
        </div>
      )}

      {!loading && evaluations.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Evaluations Yet</h3>
          <p className="text-slate-500 mb-6">Complete role evaluations before reviewing the team.</p>
          <button 
            onClick={() => navigate('/evaluation')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Go to Evaluations
          </button>
        </div>
      )}

      {!loading && evaluations.length > 0 && pendingEvals.length === 0 && !teamAnalysis && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for Team Analysis</h3>
          <p className="text-slate-500 mb-6">All role evaluations are complete. Run AI team analysis to proceed.</p>
          <button 
            onClick={runTeamAnalysis}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Run Team Analysis
          </button>
        </div>
      )}

      {!loading && evaluations.length > 0 && pendingEvals.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Individual Role Readiness</h2>
            <p className="text-slate-500 mb-6">
              {pendingEvals.length} role(s) pending AI evaluation. Run evaluations to get scores and recommendations.
            </p>
            <button 
              onClick={runRoleEvaluations}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Run AI Role Evaluations
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {evaluations.map((evaluation, idx) => {
              const founder = founders.find(f => f.id === evaluation.founderId);
              const result = roleResults[evaluation.founderId];
              
              if (!result) return null;

              return (
                <React.Fragment key={evaluation.id}>
                  <RoleReadinessCard
                    founderName={founder?.name || 'Unknown'}
                    role={evaluation.personaId}
                    score={result.score}
                    strengths={result.strengths}
                    gaps={result.gaps}
                    recommendations={result.recommendations}
                    suggestedEquityRange={result.suggestedEquityRange}
                    status={evaluation.status}
                    onApprove={() => handleApproveRole(evaluation.id)}
                    onReject={() => handleRejectRole(evaluation.id)}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {!loading && teamAnalysis && (
        <>
          <TeamCompositionView
            overallScore={teamAnalysis.overallScore}
            overlaps={teamAnalysis.overlaps}
            missingRoles={teamAnalysis.missingRoles}
            authorityGaps={teamAnalysis.authorityGaps}
            recommendations={teamAnalysis.recommendations}
            isApproved={isTeamApproved}
            onSubmit={handleApproveTeam}
          />
        </>
      )}
    </div>
  );
}
