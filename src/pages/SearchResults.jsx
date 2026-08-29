import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchNews } from '../services/newsApi';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

export default function SearchResults({ setProgress }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    document.title = query ? `Search: "${query}" - News Tak` : 'Search News - News Tak';
  }, [query]);

  const executeSearch = useCallback(async () => {
    if (!query.trim()) {
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    if (setProgress) setProgress(30);

    try {
      const data = await searchNews({ query, country: 'in' });
      setArticles(data.articles);
      setNextPage(data.nextPage);
      setTotalResults(data.totalResults);
      if (setProgress) setProgress(100);
    } catch (err) {
      console.error('Error executing news search:', err);
      setError(err.message || 'Failed to search news');
      if (setProgress) setProgress(100);
    } finally {
      setLoading(false);
    }
  }, [query, setProgress]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const handleLoadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);

    try {
      const data = await searchNews({ query, page: nextPage, country: 'in' });
      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const newArticles = data.articles.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });
      setNextPage(data.nextPage);
    } catch (err) {
      console.error('Error loading more search results:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Title Section */}
        <div className="pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
            Search Results
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Results for <span className="text-red-600 dark:text-red-500">"{query}"</span>
          </h1>
          {!loading && !error && (
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Found {totalResults || articles.length} matching stories
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={executeSearch} />
        ) : articles.length === 0 ? (
          <ErrorState type="empty" message={`No news stories found matching "${query}". Try searching with different keywords.`} />
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            {nextPage && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading results...
                    </>
                  ) : (
                    'Load More Results'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
