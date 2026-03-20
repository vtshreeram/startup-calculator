import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, PieChart } from 'lucide-react';

const steps = [
  { path: '/startup', label: 'Startup Profile', icon: LayoutDashboard },
  { path: '/evaluation', label: 'Role Evaluation', icon: ClipboardCheck },
  { path: '/team', label: 'Team Review', icon: Users },
  { path: '/equity', label: 'Equity Split', icon: PieChart },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = location.pathname === step.path;
        
        return (
          <React.Fragment key={step.path}>
            <NavLink
              to={step.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isActive ? 'bg-indigo-500' : 'bg-slate-200'}
              `}>
                {index + 1}
              </div>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{step.label}</span>
            </NavLink>
            {index < steps.length - 1 && (
              <div className="hidden lg:block w-4 h-px bg-slate-200" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
