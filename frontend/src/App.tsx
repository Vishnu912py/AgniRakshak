import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Moon, Sun } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Planner } from './pages/Planner';
import flameLogo from './assets/flame.png';

type Theme = 'dark' | 'light';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const { pathname } = useLocation();
  const navLinks = [
    { path: '/', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: '/planner', label: 'Planner', icon: <Compass className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
            <img src={flameLogo} alt="" className="h-5 w-5 object-contain" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-100">AgniRakshak</span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {navLinks.map(({ path, label, icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                {icon}<span>{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="ml-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('evacplanner-theme-v2');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('evacplanner-theme-v2', theme);
  }, [theme]);

  return (
    <Router>
      <div data-theme={theme} className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <Navbar theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
