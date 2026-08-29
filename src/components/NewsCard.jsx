import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export default function NewsCard({ article }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!article) return null;

  const { id, title, description, image_url, source_name, source_id, source_icon, pubDate } = article;

  const handleCardClick = () => {
    navigate(`/article/${encodeURIComponent(id)}`, { state: { article } });
  };

  const getFaviconUrl = () => {
    if (source_icon) return source_icon;
    if (source_id) {
      return `https://www.google.com/s2/favicons?domain=${source_id}.com&sz=32`;
    }
    return null;
  };

  const favicon = getFaviconUrl();

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image container */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        {!image_url || imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400 p-4">
            <svg className="w-10 h-10 mb-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">News Tak</span>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}
            <img
              src={image_url}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-out ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        )}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/20">
          {favicon && (
            <img
              src={favicon}
              alt=""
              className="w-3.5 h-3.5 rounded-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <span className="truncate max-w-[130px]">{source_name || source_id}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 bg-white dark:bg-slate-900">
        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2.5">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 flex-1 font-normal">
          {description || 'No description available for this story.'}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold">{formatRelativeTime(pubDate)}</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Read story
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
