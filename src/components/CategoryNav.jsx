import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCategories } from '../api/tebex.js'
import { STORE_SECTIONS } from '../data/storeSections.js'

const STATIC_TABS = [
  { id: 'home', name: '⌂', to: '/' },
  ...STORE_SECTIONS.map((section) => ({
    id: section.id,
    name: section.label,
    to: section.query === 'all' ? '/packages' : `/packages?view=${section.query}`,
  })),
  { id: 'terms', name: 'TERMS', to: '/terms' },
]

export default function CategoryNav() {
  const [cats, setCats] = useState([])
  const location = useLocation()

  useEffect(() => {
    getCategories({ includePackages: false })
      .then(setCats)
      .catch(() => setCats([]))
  }, [])

  const tabs = useMemo(() => {
    const dynamicTabs = cats
      .filter((c) => !STATIC_TABS.some((tab) => tab.name === c.name.toUpperCase()))
      .map((c) => ({
        id: c.id,
        name: c.name.toUpperCase(),
        to: `/category/${c.id}`,
      }))

    return [...STATIC_TABS, ...dynamicTabs]
  }, [cats])

  return (
    <nav className="sticky top-[88px] z-30 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-bg-border bg-bg-card/70 px-2 py-2 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-bg-card/55">
        <ul className="flex items-center gap-0.5 overflow-x-auto whitespace-nowrap category-nav-scroll">
          {tabs.map((t) => {
            const isActive =
              (t.to === '/' && location.pathname === '/') ||
              (t.to !== '/' && (
                `${location.pathname}${location.search}` === t.to ||
                (t.to === '/packages' && location.pathname === '/packages' && !location.search) ||
                (t.to.startsWith('/category/') && location.pathname.startsWith(t.to))
              ))
            return (
              <li key={t.id} className="flex-shrink-0">
                <Link
                  to={t.to}
                  className={`relative flex items-center justify-center min-h-[46px] px-4 md:px-5 py-3 text-[11px] md:text-xs font-extrabold tracking-wide transition-colors duration-200 rounded-xl ${
                    isActive
                      ? 'text-white bg-brand/10'
                      : 'text-gray-400 hover:text-white hover:bg-bg-border/40'
                  }`}
                >
                  {t.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-brand shadow-glow" />
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
