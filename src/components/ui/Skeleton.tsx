import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-slate-200 rounded', className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ScoreCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function FounderCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 grid gap-4" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-100 grid gap-4" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      ))}
    </div>
  );
}
