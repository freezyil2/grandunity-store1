import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bg-card border border-bg-border text-gray-200 hover:text-white hover:border-brand/50 transition shadow-md"
        >
          <span className="text-brand-light">⌂</span>
          <span className="font-semibold">Home</span>
        </Link>

        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition shadow-glow">
          <span>→</span>
          Log in
        </button>
      </div>
    </header>
  )
}
