import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { formatRelativeTime, formatFullDate } from '../utils/formatRelativeTime';
import { fetchNewsByCategory } from '../services/newsApi';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';

export default function ArticleDetail({ setProgress }) {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Scroll to top of page when article loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} - News Tak`;
    } else {
      document.title = 'Article Detail - News Tak';
    }
  }, [article]);

  // Fetch recommendations for "More from {category}"
  useEffect(() => {
    if (!article?.category) return;
    let isMounted = true;
    setLoadingRecs(true);

    fetchNewsByCategory({ category: article.category, country: 'in' })
      .then((res) => {
        if (isMounted) {
          const filtered = res.articles.filter((a) => a.id !== article.id).slice(0, 4);
          setRecommendations(filtered);
        }
      })
      .catch((err) => {
        console.error('Failed to load related stories:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingRecs(false);
      });

    return () => {
      isMounted = false;
    };
  }, [article]);

  if (!article) {
    return (
      <main className="min-h-screen py-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Article Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Direct navigation to article links without session state is unavailable. Please return home to select stories.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to News Feed
          </Link>
        </div>
      </main>
    );
  }

  const { title, description, content, image_url, link, source_name, source_id, source_icon, pubDate, creator, category } = article;

  // Combine and format story body into rich readable paragraphs
  let fullStoryText = '';
  if (content && description && content !== description) {
    if (content.startsWith(description)) {
      fullStoryText = content;
    } else {
      fullStoryText = `${description}\n\n${content}`;
    }
  } else {
    fullStoryText = content || description || '';
  }

  const paragraphs = fullStoryText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <main className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors py-2 px-3 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Stories
        </button>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wider rounded-full border border-red-200 dark:border-red-900/60">
            {category || 'General'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.2] mb-6">
          {title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-3">
            {source_icon ? (
              <img src={source_icon} alt="" className="w-7 h-7 rounded-full object-contain bg-white p-0.5 shadow-sm" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] uppercase">
                {(source_name || source_id || 'N').slice(0, 2)}
              </div>
            )}
            <div>
              <span className="font-bold text-slate-950 dark:text-slate-100 block">{source_name || source_id}</span>
              {creator && <span className="text-slate-600 dark:text-slate-400">By {creator}</span>}
            </div>
          </div>

          <div className="text-right">
            <span className="font-bold text-slate-900 dark:text-slate-200 block">{formatRelativeTime(pubDate)}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{formatFullDate(pubDate)}</span>
          </div>
        </div>

        {/* Hero Image */}
        {image_url && !imageError && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 max-h-[520px]">
            <img
              src={image_url}
              alt={title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover max-h-[520px]"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto">
          <div className="font-serif text-base sm:text-lg md:text-xl text-slate-900 dark:text-slate-100 leading-relaxed space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'text-lg sm:text-xl md:text-2xl font-sans font-semibold text-slate-950 dark:text-white leading-snug border-l-4 border-red-600 pl-4 py-1.5 italic mb-6 bg-slate-100/60 dark:bg-slate-900/60 rounded-r-lg'
                      : ''
                  }
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="italic text-slate-600 dark:text-slate-400">
                Summary preview unavailable for this article. Click below to view the original source.
              </p>
            )}
          </div>

          {/* External Source Link CTA */}
          <div className="my-10 p-6 md:p-8 bg-gradient-to-br from-slate-100 to-slate-200/70 dark:from-slate-900 dark:to-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
              Read the Full Story on {source_name || 'Original Publisher'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-5 max-w-lg mx-auto leading-relaxed">
              NewsData.io free tier provides condensed story excerpts. Click below to read the complete unmodified report directly at the source.
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm md:text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Read Original Article on {source_name || 'Publisher'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* More from Category Recommendations */}
        {(loadingRecs || recommendations.length > 0) && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
                More from {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Feed'}
              </h2>
              <Link
                to={`/${category || 'general'}`}
                className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingRecs
                ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
                : recommendations.map((recArticle) => (
                    <NewsCard key={recArticle.id} article={recArticle} />
                  ))}
            </div>
          </div>
        )}

      </article>
    </main>
  );
}
