import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getCategories } from '../api/tebex.js'
import PackageCard from '../components/PackageCard.jsx'
import PackageModal from '../components/PackageModal.jsx'
import CategoryNav from '../components/CategoryNav.jsx'
import { STORE_SECTIONS, matchSection } from '../data/storeSections.js'

export default function Packages() {
  const { categoryId } = useParams()
  const location = useLocation()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState(categoryId ? Number(categoryId) : null)
  const selectedView = new URLSearchParams(location.search).get('view') || 'all'

  useEffect(() => {
    setLoading(true)
    getCategories({ includePackages: true })
      .then(setCats)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setSelectedCat(categoryId ? Number(categoryId) : null)
  }, [categoryId])

  const visibleCats = useMemo(() => {
    let list = cats
    if (selectedCat) list = list.filter((c) => c.id === selectedCat)

    if (selectedView !== 'all') {
      list = list
        .map((c) => ({
          ...c,
          packages: (c.packages || []).filter((p) => matchSection(p.name, selectedView)),
        }))
        .filter((c) => c.packages.length > 0)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list
        .map((c) => ({ ...c, packages: (c.packages || []).filter((p) => p.name.toLowerCase().includes(q)) }))
        .filter((c) => c.packages.length > 0)
    }
    return list
  }, [cats, selectedCat, query])

  const activeSection = STORE_SECTIONS.find((section) => section.query === selectedView)

  return (
    <div className="particles">
      <div className="space-y-6 pt-6">
        <CategoryNav />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <section className="card p-6 md:p-8 mb-8 bg-bg-card/70 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-light mb-2">store section</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                  {activeSection ? activeSection.label : 'החנות'}
                </h1>
                <p className="text-gray-400 mt-2">
                  בחרו חבילה ושלמו דרך Tebex בצורה מאובטחת.
                </p>
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש חבילה..."
                className="bg-black/20 border border-bg-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand w-full md:w-80"
              />
            </div>
          </section>

          {!loading && cats.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-2xl font-bold text-white">קטגוריות</h2>
                <span className="text-sm text-gray-400">מעבר מהיר בין הקטגוריות בחנות</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <QuickFilterCard active={!selectedCat} title="כל החבילות" subtitle="תצוגה מלאה של כל המוצרים" onClick={() => setSelectedCat(null)} />
                {cats.map((c) => (
                  <QuickFilterCard
                    key={c.id}
                    active={selectedCat === c.id}
                    title={c.name}
                    subtitle={`${c.packages?.length || 0} מוצרים זמינים`}
                    onClick={() => setSelectedCat(c.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {loading ? (
            <Skeletons />
          ) : visibleCats.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              לא נמצאו חבילות. נסו לשנות חיפוש או לבחור קטגוריה אחרת.
            </div>
          ) : (
            visibleCats.map((cat) => (
              <section key={cat.id} className="mb-12">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-7 bg-brand rounded-full" />
                    {cat.name}
                  </h2>
                  <span className="text-sm text-gray-400">{cat.packages?.length || 0} מוצרים</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {(cat.packages || []).map((p) => (
                    <PackageCard key={p.id} pkg={p} onOpen={setActive} />
                  ))}
                </div>
              </section>
            ))
          )}

          <PackageModal pkg={active} onClose={() => setActive(null)} />
        </div>
      </div>
    </div>
  )
}

function QuickFilterCard({ active, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-right rounded-2xl border p-5 transition-all duration-200 ${
        active
          ? 'bg-brand/15 border-brand/50 shadow-glow'
          : 'bg-bg-card/80 border-bg-border hover:border-brand/50 hover:bg-bg-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`font-bold ${active ? 'text-white' : 'text-gray-100'}`}>{title}</div>
          <div className="text-sm text-gray-400 mt-1">{subtitle}</div>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${active ? 'bg-brand shadow-glow' : 'bg-gray-600'}`} />
      </div>
    </button>
  )
}

function Skeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-[4/3] bg-bg-border" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-bg-border rounded w-2/3" />
            <div className="h-8 bg-bg-border rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
