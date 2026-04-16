import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCategories } from '../api/tebex.js'

const STATIC_TABS = [
  { id: 'home', name: 'HOME', icon: '⌂', to: '/' },
]

export default function CategoryNav() {
  const [cats, setCats] = useState([])
  const location = useLocation()

  useEffect(() => {
    getCategories({ includePackages: false })
      .then(setCats)
      .catch(() => setCats([]))
  }, [])

  const tabs = [
    ...STATIC_TABS,
    ...cats.map((c) => ({
      id: c.id,
      name: c.name.toUpperCase(),
      to: `/category/${c.id}`,
    })),
  ]

  return (
    <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-bg-card/70 backdrop-blur border border-bg-border rounded-2xl px-2 py-1 shadow-xl">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const isActive =
              (t.to === '/' && location.pathname === '/') ||
              (t.to !== '/' && location.pathname.startsWith(t.to))
            return (
              <li key={t.id} className="flex-shrink-0">
                <Link
                  to={t.to}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.icon && <span className="text-base">{t.icon}</span>}
                  {t.name}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand rounded-full shadow-glow" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
