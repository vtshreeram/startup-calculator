import React from 'react';
import { AlertTriangle, CheckCircle2, Users, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

interface Overlap {
  roles: string[];
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface MissingRole {
  role: string;
  criticality: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

interface AuthorityGap {
  domain: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface TeamCompositionViewProps {
  overallScore: number;
  overlaps: Overlap[];
  missingRoles: MissingRole[];
  authorityGaps: AuthorityGap[];
  recommendations: string[];
  onSubmit?: () => void;
  isApproved?: boolean;
}

export function TeamCompositionView({
  overallScore,
  overlaps,
  missingRoles,
  authorityGaps,
  recommendations,
  onSubmit,
  isApproved = false,
}: TeamCompositionViewProps) {
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'low': return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getCriticalityBadge = (criticality: 'high' | 'medium' | 'low') => {
    switch (criticality) {
      case 'high': return <Badge variant="red">High</Badge>;
      case 'medium': return <Badge variant="amber">Medium</Badge>;
      case 'low': return <Badge variant="slate">Low</Badge>;
    }
  };

  const hasIssues = overlaps.length > 0 || missingRoles.length > 0 || authorityGaps.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn(
          'rounded-2xl p-6 border-2',
          overallScore >= 80 ? 'bg-emerald-50 border-emerald-200' :
          overallScore >= 60 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        )}>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-bold text-slate-900">Team Score</span>
          </div>
          <p className={cn(
            'text-4xl font-bold',
            overallScore >= 80 ? 'text-emerald-600' :
            overallScore >= 60 ? 'text-amber-600' :
            'text-red-600'
          )}>
            {overallScore}/100
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-900">Issues Found</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{overlaps.length + missingRoles.length + authorityGaps.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-slate-400" />
            )}
            <span className="font-bold text-slate-900">Status</span>
          </div>
          {isApproved ? (
            <Badge variant="emerald" className="text-base px-4 py-1">Team Approved</Badge>
          ) : (
            <Badge variant="amber" className="text-base px-4 py-1">Pending Approval</Badge>
          )}
        </div>
      </div>

      {overlaps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Role Overlaps
          </h3>
          <div className="grid gap-4">
            {overlaps.map((overlap, i) => (
              <div key={i} className={cn('p-4 rounded-xl border', getSeverityColor(overlap.severity))}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    {overlap.roles.map((r) => (
                      <React.Fragment key={r}>
                        <Badge variant={overlap.severity === 'high' ? 'red' : overlap.severity === 'medium' ? 'amber' : 'slate'}>
                          {r}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                  <Badge variant={overlap.severity === 'high' ? 'red' : overlap.severity === 'medium' ? 'amber' : 'slate'}>
                    {overlap.severity} severity
                  </Badge>
                </div>
                <p className="text-sm">{overlap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {missingRoles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Missing Critical Roles
          </h3>
          <div className="grid gap-4">
            {missingRoles.map((missing, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-slate-900">{missing.role}</span>
                  {getCriticalityBadge(missing.criticality)}
                </div>
                <p className="text-sm text-slate-600">{missing.suggestedAction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {authorityGaps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Authority Gaps
          </h3>
          <div className="grid gap-4">
            {authorityGaps.map((gap, i) => (
              <div key={i} className={cn('p-4 rounded-xl border', getSeverityColor(gap.severity))}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold">{gap.domain}</span>
                  <Badge variant={gap.severity === 'high' ? 'red' : gap.severity === 'medium' ? 'amber' : 'slate'}>
                    {gap.severity}
                  </Badge>
                </div>
                <p className="text-sm">{gap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Team Recommendations</h3>
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <ul className="space-y-3">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-indigo-800">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!isApproved && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Approve Team & Proceed to Equity
          </button>
        </div>
      )}
    </div>
  );
}
