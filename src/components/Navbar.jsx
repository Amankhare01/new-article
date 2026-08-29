import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const categories = [
  { name: 'General', path: '/general' },
  { name: 'Business', path: '/business' },
  { name: 'Entertainment', path: '/entertainment' },
  { name: 'Health', path: '/health' },
  { name: 'Science', path: '/science' },
  { name: 'Sports', path: '/sports' },
  { name: 'Technology', path: '/technology' },
];

export default function Navbar({ isDarkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-800' 
        : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                NT
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                News<span className="text-red-600 dark:text-red-500">Tak</span>
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              Top News
            </NavLink>

            {categories.map((cat) => (
              <NavLink
                key={cat.path}
                to={cat.path}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </nav>

          {/* Search & Dark Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 sm:shrink min-w-0">
            {/* Desktop Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block min-w-0 flex-1 w-32 sm:w-40 md:w-52 lg:w-56 xl:w-64 max-w-[260px]">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 rounded-full border border-slate-300 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
              />
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 rounded-lg border border-slate-300 dark:border-slate-700 focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
              />
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-5 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            <nav className="grid grid-cols-2 gap-1 px-2">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                Top News
              </NavLink>
              {categories.map((cat) => (
                <NavLink
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {cat.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
