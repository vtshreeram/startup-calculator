import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StartupProfile, StartupStage } from '../types';
import { IndustrySelector } from './IndustrySelector';
import { cn } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

const schema = z.object({
  industry: z.string().min(1, 'Select an industry'),
  stage: z.enum(['Pre-seed', 'Seed', 'Series A', 'Series B+']),
  teamSize: z.number().min(1).max(100),
});

interface StartupProfileWizardProps {
  initialData: StartupProfile | null;
  onComplete: (data: StartupProfile) => void;
}

export function StartupProfileWizard({ initialData, onComplete }: StartupProfileWizardProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StartupProfile>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      industry: '',
      stage: 'Pre-seed',
      teamSize: 2,
    },
  });

  const selectedIndustry = watch('industry');

  const onSubmit = (data: StartupProfile) => {
    onComplete(data);
  };

  const stages: StartupStage[] = ['Pre-seed', 'Seed', 'Series A', 'Series B+'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">1. Select Industry</h2>
          <p className="text-slate-500">Choose the sector that best describes your startup.</p>
        </div>
        <IndustrySelector
          selectedId={selectedIndustry}
          onSelect={(id) => setValue('industry', id, { shouldValidate: true })}
        />
        {errors.industry && (
          <p className="text-red-500 text-sm">{errors.industry.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">2. Current Stage</h2>
            <p className="text-slate-500">What phase is your company in?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => {
              const isActive = watch('stage') === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setValue('stage', stage)}
                  className={cn(
                    'px-6 py-3 rounded-xl border-2 font-semibold transition-all',
                    isActive
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">3. Team Size</h2>
            <p className="text-slate-500">How many co-founders/early employees?</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              {...register('teamSize', { valueAsNumber: true })}
              className="w-24 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none font-bold text-lg"
            />
            <span className="text-slate-500 font-medium">Core team members</span>
          </div>
          {errors.teamSize && (
            <p className="text-red-500 text-sm">{errors.teamSize.message}</p>
          )}
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          Proceed to Role Evaluation
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
