import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCategories } from '../api/tebex.js'
import PackageCard from '../components/PackageCard.jsx'
import PackageModal from '../components/PackageModal.jsx'

export default function Packages() {
  const { categoryId } = useParams()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState(categoryId ? Number(categoryId) : null)

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
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list
        .map((c) => ({ ...c, packages: (c.packages || []).filter((p) => p.name.toLowerCase().includes(q)) }))
        .filter((c) => c.packages.length > 0)
    }
    return list
  }, [cats, selectedCat, query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">החנות</h1>
          <p className="text-gray-400 mt-1">בחרו חבילה ושלמו דרך Tebex בצורה מאובטחת.</p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש חבילה..."
          className="bg-bg-card border border-bg-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand w-full md:w-72"
        />
      </div>

      {/* Category chips */}
      {!loading && cats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Chip active={!selectedCat} onClick={() => setSelectedCat(null)}>הכל</Chip>
          {cats.map((c) => (
            <Chip key={c.id} active={selectedCat === c.id} onClick={() => setSelectedCat(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
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
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-brand rounded-full" />
              {cat.name}
            </h2>
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
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
        active
          ? 'bg-brand text-white border-brand shadow-glow'
          : 'bg-bg-card text-gray-300 border-bg-border hover:border-brand/50 hover:text-white'
      }`}
    >
      {children}
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
