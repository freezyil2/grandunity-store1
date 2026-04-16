import { useEffect, useState } from 'react'
import { buyPackage } from '../api/tebex.js'

export default function PackageModal({ pkg, onClose }) {
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!pkg) return null

  const handleBuy = async () => {
    try {
      setBusy(true)
      const url = await buyPackage(pkg.id)
      if (url) window.location.href = url
    } catch (e) {
      alert('שגיאה: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  const symbol = pkg.currency === 'USD' ? '$' : pkg.currency || '$'
  const onSale = pkg.total_price != null && pkg.base_price != null && pkg.total_price < pkg.base_price

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bg-panel border border-bg-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-bg-card to-black flex items-center justify-center p-8 min-h-[280px]">
          <img
            src={pkg.image || '/images/placeholder.svg'}
            alt={pkg.name}
            className="max-h-[420px] object-contain"
            onError={(e) => { e.currentTarget.src = '/images/placeholder.svg' }}
          />
        </div>
        <div className="p-6 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-2xl font-extrabold text-white">{pkg.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
          </div>

          <div
            className="prose prose-invert text-gray-300 text-sm max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: pkg.description || '<p>אין תיאור זמין.</p>' }}
          />

          <div className="mt-auto pt-4 border-t border-bg-border flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {onSale && (
                <span className="text-gray-500 line-through">{symbol}{Number(pkg.base_price).toFixed(2)}</span>
              )}
              <span className="text-brand text-3xl font-extrabold">
                {symbol}{Number(pkg.total_price ?? pkg.base_price).toFixed(2)}
              </span>
            </div>
            <button onClick={handleBuy} disabled={busy} className="btn-primary disabled:opacity-60">
              {busy ? '...טוען' : 'קנה עכשיו'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
