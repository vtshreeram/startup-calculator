import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calculator, GraduationCap } from 'lucide-react';
import { EvaluationProvider } from './contexts/EvaluationContext';
import { Navigation } from './components/Navigation';
import StartupProfilePage from './pages/StartupProfilePage';
import RoleEvaluationPage from './pages/RoleEvaluationPage';
import TeamCompositionPage from './pages/TeamCompositionPage';
import EquityCalculatorPage from './pages/EquityCalculatorPage';

export default function App() {
  return (
    <BrowserRouter>
      <EvaluationProvider>
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
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold ml-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Advisor Edition
                </span>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Navigation />
            
            <Routes>
              <Route path="/startup" element={<StartupProfilePage />} />
              <Route path="/evaluation" element={<RoleEvaluationPage />} />
              <Route path="/team" element={<TeamCompositionPage />} />
              <Route path="/equity" element={<EquityCalculatorPage />} />
              <Route path="/" element={<Navigate to="/startup" replace />} />
            </Routes>
          </main>
        </div>
      </EvaluationProvider>
    </BrowserRouter>
  );
}
