import { Link, NavLink, Outlet, useMatch } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/', label: 'About Me', end: true },
  { to: '/reading-list', label: 'Reading List' },
  { to: '/wealth-lab', label: 'Wealth Lab' },
  { to: '/blog', label: 'Blog' },
];

export default function Layout() {
  const isLongFormPost = useMatch('/blog/abel-ruffini-backwards') !== null;
  const containerWidth = isLongFormPost ? 'max-w-7xl' : 'max-w-5xl';

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <header className="site-header">
        <div className={`mx-auto flex ${containerWidth} flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4`}>
          <Link
            to="/"
            aria-label="Go to homepage"
            className="group flex items-baseline gap-3"
          >
            <span className="font-serif text-xl tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
              Siyuan Song
            </span>
            <span lang="zh" className="font-zh text-sm text-[var(--ink-faint)]">
              宋思源
            </span>
          </Link>
          <ThemeToggle className="sm:order-3" />
          <nav
            className="site-nav order-3 -mx-6 flex w-[calc(100%+3rem)] gap-x-6 overflow-x-auto px-6 pb-1 sm:order-2 sm:mx-0 sm:ml-auto sm:w-auto sm:gap-x-7 sm:overflow-visible sm:px-0 sm:pb-0"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="site-nav__link shrink-0 whitespace-nowrap">
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-6 pb-24 pt-14 sm:pt-20 ${containerWidth}`}>
        <Outlet />
      </main>
    </div>
  );
}
