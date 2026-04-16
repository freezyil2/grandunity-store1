import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCategories } from '../api/tebex.js'
import PackageCard from '../components/PackageCard.jsx'
import PackageModal from '../components/PackageModal.jsx'
import Hero from '../components/Hero.jsx'
import Sidebar from '../components/Sidebar.jsx'
import CategoryNav from '../components/CategoryNav.jsx'

export default function Home() {
  const [cats, setCats] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)

  useEffect(() => {
    getCategories({ includePackages: true })
      .then((data) => {
        setCats(data)
        const all = data.flatMap((c) => c.packages || [])
        setFeatured(all.slice(0, 4))
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="particles">
      <Hero />
      <CategoryNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
          <Sidebar />

          <div className="space-y-10">
            <section className="card p-6 md:p-8 fade-in">
              <p className="text-xs tracking-[0.3em] text-brand-light mb-2 uppercase">
                welcome to
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand mb-3">
                GrandUnity RP — Allowlist Store
              </h1>
              <div className="space-y-3 text-sm md:text-base text-gray-300 leading-relaxed">
                <p>
                  זהו האתר הרשמי לרכישת חבילות ותמיכה ב־
                  <span className="font-semibold text-white">GrandUnity RP</span>. כאן תוכלו
                  לרכוש גישה לשרת, מנויים, כסף במשחק ועוד פריטים מיוחדים – הכל דרך מערכת Tebex.
                </p>
                <p>
                  לאחר רכישה, ודאו שהכנסתם את ה־Steam / Rockstar / License ID הנכונים, ושאתם מחוברים לשרת עם אותו
                  משתמש. תהליך האישור מתבצע בדרך כלל באופן אוטומטי תוך מספר דקות.
                </p>
                <p className="text-xs text-gray-500">
                  שימו לב: רכישה בחנות אינה מקנה חסינות מעונשים בשרת ואינה ניתנת להחזר. לכל בעיה בתשלום ניתן לפנות
                  לצוות דרך הדיסקורד הרשמי.
                </p>
              </div>
            </section>

            <section className="py-4">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">חבילות מובילות</h2>
                <Link to="/packages" className="text-brand hover:text-brand-light text-sm font-medium">
                  לכל החבילות →
                </Link>
              </div>

              {loading ? (
                <SkeletonGrid />
              ) : featured.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featured.map((p) => (
                    <PackageCard key={p.id} pkg={p} onOpen={setActive} />
                  ))}
                </div>
              )}
            </section>

            {!loading && cats.length > 0 && (
              <section className="py-4">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">קטגוריות</h2>
                  <span className="text-sm text-gray-400">בחרו קטגוריה כדי לעבור במהירות לאזור המתאים</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cats.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.id}`}
                      className="card p-5 hover:bg-brand/10 bg-bg-card/80 backdrop-blur"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">{c.name}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            {c.packages?.length || 0} מוצרים
                          </div>
                        </div>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand-light text-lg">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <PackageModal pkg={active} onClose={() => setActive(null)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
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

function EmptyState() {
  return (
    <div className="card p-10 text-center text-gray-400">
      לא נמצאו חבילות זמינות ב־Tebex. ודאו שה־Public Token תקין וש־Webstore פעיל.
    </div>
  )
}
