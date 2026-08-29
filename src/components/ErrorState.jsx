import React from 'react';

export default function ErrorState({ type = 'generic', message, onRetry }) {
  if (type === 'missing_key' || message === 'API_KEY_MISSING') {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 md:p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-amber-900 dark:text-amber-200 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold">NewsData.io API Key Required</h3>
        </div>
        <p className="text-sm md:text-base leading-relaxed mb-4">
          To display real-time news articles, you need a free API key from <a href="https://newsdata.io/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-100">NewsData.io</a>.
        </p>
        <div className="bg-amber-100/80 dark:bg-amber-900/40 p-4 rounded-lg font-mono text-xs md:text-sm mb-4 border border-amber-200 dark:border-amber-800 overflow-x-auto">
          <p className="text-amber-800 dark:text-amber-300 mb-1"># 1. Open or create .env in project root</p>
          <p className="font-bold text-amber-950 dark:text-amber-100">REACT_APP_NEWSDATA_API_KEY=your_api_key_here</p>
          <p className="text-amber-800 dark:text-amber-300 mt-2"># 2. Restart your React development server</p>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Once your key is configured, refresh the page to view news feeds.
        </p>
      </div>
    );
  }

  if (type === 'rate_limit' || message === 'RATE_LIMIT_EXCEEDED') {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-2xl text-center shadow-sm">
        <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/60 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">API Rate Limit Exceeded</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          You've reached the request limit for the NewsData.io free tier. Please wait a few moments before requesting more articles.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            Retry Request
          </button>
        )}
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Articles Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {message || 'We could not find any news matching your current topic or search parameters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl text-center shadow-sm">
      <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/60 rounded-full flex items-center justify-center text-red-600 dark:text-red-300">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Unable to Load News</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        {message || 'An unexpected error occurred while fetching the latest stories.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg text-sm transition-colors shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
