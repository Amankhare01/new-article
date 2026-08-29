import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full shrink-0" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1">
        {/* Source Badge & Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-11/12" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-20" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
