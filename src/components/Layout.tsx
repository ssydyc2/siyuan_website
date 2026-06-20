import { Link, NavLink, Outlet } from 'react-router-dom';
import geekAvatar from '../assets/avatars/geek-avatar.png';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  return (
    <div className="min-h-screen text-[var(--ink)]">
      <header className="border-b border-[var(--rule-strong)] bg-[var(--paper-elevated)]/80">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-8 flex items-center gap-4 sm:gap-5">
            <Link
              to="/"
              aria-label="Go to homepage"
              className="shrink-0 rounded-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <img
                src={geekAvatar}
                alt="Pixel avatar of Siyuan Song"
                className="h-20 w-20 object-contain [image-rendering:pixelated] sm:h-24 sm:w-24"
              />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--ink)] sm:text-5xl">
                  Siyuan Song
                </h1>
                <ThemeToggle className="mt-1" />
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="h-px w-12 bg-[var(--rule-strong)] sm:w-14"></div>
                <span className="font-mono text-lg tracking-[0.24em] text-[var(--ink-muted)] sm:text-xl">
                  宋思源
                </span>
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              About Me
            </NavLink>
            <NavLink
              to="/reading-list"
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              Reading List
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              Blog <span aria-hidden="true">&rarr;</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
