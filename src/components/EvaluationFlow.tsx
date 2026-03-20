import React, { useState } from 'react';
import { Founder, RoleEvaluation, Persona } from '../types';
import { PersonaSelector } from './PersonaSelector';
import { ResponsibilityMatrix } from './ResponsibilityMatrix';
import { AuthorityBuilder } from './AuthorityBuilder';
import { SupportRequirements } from './SupportRequirements';
import { EvidenceUploader } from './EvidenceUploader';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface EvaluationFlowProps {
  founder: Founder;
  industryId: string;
  initialEvaluation: RoleEvaluation | null;
  onSave: (evaluation: RoleEvaluation) => void;
  onCancel: () => void;
}

type Step = 'persona' | 'responsibilities' | 'authorities' | 'support' | 'evidence';

export function EvaluationFlow({ founder, industryId, initialEvaluation, onSave, onCancel }: EvaluationFlowProps) {
  const [step, setStep] = useState<Step>('persona');
  const [evaluation, setEvaluation] = useState<RoleEvaluation>(initialEvaluation || {
    id: crypto.randomUUID(),
    founderId: founder.id,
    personaId: '',
    responsibilities: [],
    authorities: [],
    supportRequirements: [],
    evidence: [],
    status: 'pending',
  });

  const steps: Step[] = ['persona', 'responsibilities', 'authorities', 'support', 'evidence'];
  const currentStepIndex = steps.indexOf(step);

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const prev = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
    setEvaluation({ 
      ...evaluation, 
      personaId: persona.id,
      responsibilities: persona.typicalResponsibilities.map(r => ({
        id: crypto.randomUUID(),
        label: r,
        commitmentLevel: 3,
        hoursPerWeek: 40
      }))
    });
    next();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Evaluating {founder.name}</h2>
          <p className="text-sm text-slate-500">Step {currentStepIndex + 1} of {steps.length}: {step.charAt(0).toUpperCase() + step.slice(1)}</p>
        </div>
        <button onClick={onCancel} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[400px]">
        {step === 'persona' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Choose a Role Template</h3>
            <PersonaSelector 
              industryId={industryId} 
              selectedId={evaluation.personaId} 
              onSelect={handlePersonaSelect} 
            />
          </div>
        )}

        {step === 'responsibilities' && (
          <ResponsibilityMatrix 
            responsibilities={evaluation.responsibilities} 
            onChange={(resps) => setEvaluation({ ...evaluation, responsibilities: resps })} 
          />
        )}

        {step === 'authorities' && (
          <AuthorityBuilder 
            authorities={evaluation.authorities} 
            onChange={(auths) => setEvaluation({ ...evaluation, authorities: auths })} 
          />
        )}

        {step === 'support' && (
          <SupportRequirements 
            requirements={evaluation.supportRequirements} 
            onChange={(reqs) => setEvaluation({ ...evaluation, supportRequirements: reqs })} 
          />
        )}

        {step === 'evidence' && (
          <EvidenceUploader 
            evidence={evaluation.evidence} 
            onChange={(evs) => setEvaluation({ ...evaluation, evidence: evs })} 
          />
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={prev}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-30"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>

        {currentStepIndex === steps.length - 1 ? (
          <button
            onClick={() => onSave(evaluation)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            <Save className="w-5 h-5" />
            Finish Evaluation
          </button>
        ) : (
          <button
            onClick={next}
            disabled={step === 'persona' && !evaluation.personaId}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            Next Step
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
