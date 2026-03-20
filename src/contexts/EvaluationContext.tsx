import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StartupProfile, RoleEvaluation, Founder } from '../types';

interface EvaluationContextType {
  startup: StartupProfile | null;
  setStartup: (startup: StartupProfile) => void;
  evaluations: RoleEvaluation[];
  setEvaluations: (evaluations: RoleEvaluation[]) => void;
  founders: Founder[];
  setFounders: (founders: Founder[]) => void;
  updateEvaluation: (evaluation: RoleEvaluation) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startup, setStartup] = useState<StartupProfile | null>(() => {
    const saved = localStorage.getItem('startup');
    return saved ? JSON.parse(saved) : null;
  });

  const [evaluations, setEvaluations] = useState<RoleEvaluation[]>(() => {
    const saved = localStorage.getItem('evaluations');
    return saved ? JSON.parse(saved) : [];
  });

  const [founders, setFounders] = useState<Founder[]>(() => {
    const saved = localStorage.getItem('founders');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Founder 1',
        role: 'CEO',
        factors: { idea: 8, skills: 7, time: 10, capital: 5, network: 6, risk: 8 },
      },
      {
        id: '2',
        name: 'Founder 2',
        role: 'CTO',
        factors: { idea: 3, skills: 9, time: 10, capital: 2, network: 4, risk: 8 },
      },
    ];
  });

  useEffect(() => {
    if (startup) {
      localStorage.setItem('startup', JSON.stringify(startup));
    }
  }, [startup]);

  useEffect(() => {
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('founders', JSON.stringify(founders));
  }, [founders]);

  const updateEvaluation = (evaluation: RoleEvaluation) => {
    setEvaluations((prev) => {
      const index = prev.findIndex((e) => e.id === evaluation.id);
      if (index >= 0) {
        const newEvaluations = [...prev];
        newEvaluations[index] = evaluation;
        return newEvaluations;
      }
      return [...prev, evaluation];
    });
  };

  return (
    <EvaluationContext.Provider
      value={{ startup, setStartup, evaluations, setEvaluations, founders, setFounders, updateEvaluation }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};
