import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const themeStorageKey = 'siyuan-site-theme';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem(themeStorageKey, theme);
  }, [isDarkMode, theme]);

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleTheme: () => {
        setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
      },
    }),
    [isDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('ThemeToggle must be used inside ThemeProvider');
  }

  return themeContext;
}

function BulbIcon({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill={isDarkMode ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5c-1.3-1-2-2.5-2-4.2a5.5 5.5 0 0 1 11 0c0 1.7-.7 3.2-2 4.2-.8.6-1.3 1.4-1.5 2.5h-4c-.2-1.1-.7-1.9-1.5-2.5Z" />
      <path d="M12 2v1.5" />
      <path d="m4.9 4.9 1.1 1.1" />
      <path d="M2 12h1.5" />
      <path d="m19.1 4.9-1.1 1.1" />
      <path d="M20.5 12H22" />
    </svg>
  );
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--rule)] bg-[var(--paper-elevated)] text-[var(--ink-muted)] shadow-[2px_2px_0_var(--shadow-rule)] transition-colors hover:border-[var(--rule-strong)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <BulbIcon isDarkMode={isDarkMode} />
    </button>
  );
}
