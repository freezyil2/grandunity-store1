import { Link, NavLink } from 'react-router-dom'

const DISCORD_INVITE = import.meta.env.VITE_DISCORD_INVITE || '#'

export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-md border-b border-bg-border" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-glow flex items-center justify-center text-white font-extrabold">
            GU
          </span>
          <span className="leading-tight">
            <span className="block text-white font-extrabold tracking-wide">GrandUnity RP</span>
            <span className="block text-[11px] text-gray-400 tracking-[0.25em] uppercase">Official Store</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-bold tracking-wide border transition ${
                isActive
                  ? 'bg-brand/15 border-brand/50 text-white shadow-glow'
                  : 'bg-bg-card/60 border-bg-border text-gray-300 hover:text-white hover:border-brand/50'
              }`
            }
          >
            בית
          </NavLink>
          <NavLink
            to="/packages"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-bold tracking-wide border transition ${
                isActive
                  ? 'bg-brand/15 border-brand/50 text-white shadow-glow'
                  : 'bg-bg-card/60 border-bg-border text-gray-300 hover:text-white hover:border-brand/50'
              }`
            }
          >
            חבילות
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-bold tracking-wide border transition ${
                isActive
                  ? 'bg-brand/15 border-brand/50 text-white shadow-glow'
                  : 'bg-bg-card/60 border-bg-border text-gray-300 hover:text-white hover:border-brand/50'
              }`
            }
          >
            על השרת
          </NavLink>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-bold tracking-wide border bg-bg-card/60 border-bg-border text-gray-300 hover:text-white hover:border-brand/50 transition"
          >
            דיסקורד
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/packages" className="btn-ghost hidden sm:inline-flex">
            לכל החבילות
          </Link>
          <button className="btn-primary">
            התחברות
          </button>
        </div>
      </div>
    </header>
  )
}
