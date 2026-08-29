import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { formatRelativeTime, formatFullDate } from '../utils/formatRelativeTime';
import { estimateReadTime } from '../utils/estimateReadTime';
import { getPrimaryCategory, formatCategoryDisplay } from '../utils/formatCategory';
import { fetchNewsByCategory } from '../services/newsApi';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';

export default function ArticleDetail({ setProgress }) {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const primaryCategory = article ? getPrimaryCategory(article.category) : 'general';
  const displayCategory = article ? formatCategoryDisplay(article.category) : 'General';
  const categoryHeaderName = article ? formatCategoryDisplay(article.category, 1) : 'General';

  // Fetch recommendations for "More from {category}"
  useEffect(() => {
    if (!article?.category) return;
    let isMounted = true;
    setLoadingRecs(true);

    fetchNewsByCategory({ category: primaryCategory, country: 'in' })
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
  }, [article, primaryCategory]);

  const handleCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
    });
  };

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

  const { title, description, content, image_url, link, source_name, source_id, source_icon, pubDate, creator, keywords } = article;

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
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex-wrap">
          <Link to="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Home
          </Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <Link to={`/${primaryCategory === 'top' ? 'general' : primaryCategory}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
            {categoryHeaderName}
          </Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-400 dark:text-slate-500 font-semibold truncate max-w-[150px] sm:max-w-[250px]">
            Article
          </span>
        </nav>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wider rounded-full border border-red-200 dark:border-red-900/60">
            {displayCategory}
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
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 min-h-[220px] max-h-[520px]">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-400">
                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <img
              src={image_url}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover max-h-[520px] transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
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

          {/* Metadata Strip: Read Time, Share Actions & Topic Pills */}
          <div className="my-8 p-5 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Estimated Read Time */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{estimateReadTime(fullStoryText)}</span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Share:</span>
                
                {/* Copy Link */}
                <div className="relative">
                  <button
                    onClick={handleCopyLink}
                    title="Copy article link"
                    aria-label="Copy article link"
                    className="p-2 rounded-full text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold rounded shadow-md whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share to WhatsApp"
                  aria-label="Share to WhatsApp"
                  className="p-2 rounded-full text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share to X (Twitter)"
                  aria-label="Share to X (Twitter)"
                  className="p-2 rounded-full text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Keyword / Topic Pills */}
            {keywords && keywords.length > 0 && (
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Topics:</span>
                {keywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 text-xs font-medium bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-full border border-slate-300/50 dark:border-slate-700/50"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
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
                More from {categoryHeaderName}
              </h2>
              <Link
                to={`/${primaryCategory === 'top' ? 'general' : primaryCategory}`}
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
