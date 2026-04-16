import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function getStatus(search) {
  const p = new URLSearchParams(search)
  return p.get('status')
}

export default function CheckoutStatusToast() {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const s = getStatus(location.search)
    if (!s) return
    if (s !== 'success' && s !== 'cancel') return
    setStatus(s)

    const t = setTimeout(() => setStatus(null), 4500)

    // Remove status param to avoid showing again on refresh/navigation
    const p = new URLSearchParams(location.search)
    p.delete('status')
    const nextSearch = p.toString()
    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '', hash: location.hash },
      { replace: true }
    )

    return () => clearTimeout(t)
  }, [location.pathname, location.search, location.hash, navigate])

  if (!status) return null
  const ok = status === 'success'

  return (
    <div className="fixed z-[70] bottom-5 right-5 md:bottom-7 md:right-7 max-w-[92vw]">
      <div
        className={`flex items-start gap-3 rounded-2xl border backdrop-blur px-4 py-3 shadow-2xl ${
          ok
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}
        role="status"
        aria-live="polite"
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold ${
            ok ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {ok ? '✓' : '!'}
        </div>
        <div className="min-w-0">
          <div className="text-white font-extrabold">
            {ok ? 'התשלום הושלם בהצלחה' : 'התשלום בוטל'}
          </div>
          <div className="text-sm text-gray-300">
            {ok
              ? 'אם לא קיבלת את החבילה תוך כמה דקות — פנה לצוות בדיסקורד.'
              : 'אפשר לבחור חבילה אחרת ולנסות שוב בכל רגע.'}
          </div>
        </div>
        <button
          onClick={() => setStatus(null)}
          className="ml-2 text-gray-400 hover:text-white text-xl leading-none"
          aria-label="סגירה"
        >
          ×
        </button>
      </div>
    </div>
  )
}

