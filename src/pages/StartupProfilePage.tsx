import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvaluation } from '../contexts/EvaluationContext';
import { StartupProfileWizard } from '../components/StartupProfileWizard';
import { StartupProfile } from '../types';

export default function StartupProfilePage() {
  const { startup, setStartup } = useEvaluation();
  const navigate = useNavigate();

  const handleComplete = (data: StartupProfile) => {
    setStartup(data);
    navigate('/evaluation');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10">
      <StartupProfileWizard
        initialData={startup}
        onComplete={handleComplete}
      />
    </div>
  );
}
