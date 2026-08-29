import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Navbar from './components/Navbar';
import NewsHome from './pages/NewsHome';
import ArticleDetail from './pages/ArticleDetail';
import SearchResults from './pages/SearchResults';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('news_tak_dark_mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('news_tak_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <LoadingBar
        color="#ef4444"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <Routes>
        {/* Main Feed Routes */}
        <Route path="/" element={<NewsHome category="top" setProgress={setProgress} />} />
        <Route path="/business" element={<NewsHome key="business" category="business" setProgress={setProgress} />} />
        <Route path="/entertainment" element={<NewsHome key="entertainment" category="entertainment" setProgress={setProgress} />} />
        <Route path="/general" element={<NewsHome key="general" category="general" setProgress={setProgress} />} />
        <Route path="/health" element={<NewsHome key="health" category="health" setProgress={setProgress} />} />
        <Route path="/science" element={<NewsHome key="science" category="science" setProgress={setProgress} />} />
        <Route path="/sports" element={<NewsHome key="sports" category="sports" setProgress={setProgress} />} />
        <Route path="/technology" element={<NewsHome key="technology" category="technology" setProgress={setProgress} />} />

        {/* Article Detail View Route */}
        <Route path="/article/:id" element={<ArticleDetail setProgress={setProgress} />} />

        {/* Search Results Route */}
        <Route path="/search" element={<SearchResults setProgress={setProgress} />} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<NewsHome category="top" setProgress={setProgress} />} />
      </Routes>
    </div>
  );
}
