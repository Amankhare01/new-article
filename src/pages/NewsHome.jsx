import React, { useState, useEffect, useCallback } from 'react';
import { fetchNewsByCategory } from '../services/newsApi';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

export default function NewsHome({ category = 'top', setProgress }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);

  const displayCategoryName = category === 'top' || category === 'general' ? 'Top Headlines' : category.charAt(0).toUpperCase() + category.slice(1);

  // Update document title
  useEffect(() => {
    document.title = `${displayCategoryName} - News Tak`;
  }, [displayCategoryName]);

  const loadInitialNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (setProgress) setProgress(30);

    try {
      const data = await fetchNewsByCategory({ category, country: 'in' });
      setArticles(data.articles);
      setNextPage(data.nextPage);
      if (setProgress) setProgress(100);
    } catch (err) {
      console.error('Error fetching category news:', err);
      setError(err.message || 'Failed to fetch news');
      if (setProgress) setProgress(100);
    } finally {
      setLoading(false);
    }
  }, [category, setProgress]);

  useEffect(() => {
    loadInitialNews();
  }, [loadInitialNews]);

  const handleLoadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);

    try {
      const data = await fetchNewsByCategory({ category, page: nextPage, country: 'in' });
      
      // Deduplicate articles by id
      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const newArticles = data.articles.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });
      setNextPage(data.nextPage);
    } catch (err) {
      console.error('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              {category === 'top' || category === 'general' ? 'India' : 'Category'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              {displayCategoryName}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Real-time coverage & updates from India and around the globe
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadInitialNews} />
        ) : articles.length === 0 ? (
          <ErrorState type="empty" message={`No news found for ${displayCategoryName}.`} />
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination / Load More Button */}
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
                      Loading stories...
                    </>
                  ) : (
                    'Load More Stories'
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
