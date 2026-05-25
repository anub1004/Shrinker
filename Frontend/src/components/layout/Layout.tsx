import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-black dark:text-white bg-white text-black">
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 sticky top-0 z-50 bg-white dark:bg-black">
        <nav className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-light tracking-wider">
              Shrinker<span className="text-gray-400">.</span>
            </h1>
            <div className="flex items-center gap-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">Open Source • Free</p>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                title="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-600 dark:text-gray-500 text-xs mt-16">
        <p className="mb-2">© 2026 Shrink • Built with Spring Boot + Redis</p>
        <p>Designed & developed by <span className="font-semibold text-black dark:text-white">Anubhav Singh</span></p>
      </footer>
    </div>
  );
};
