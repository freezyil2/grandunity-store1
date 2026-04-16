import { useState } from 'react'
import { buyPackage } from '../api/tebex.js'

function formatPrice(pkg) {
  const sale = pkg?.total_price ?? pkg?.base_price
  const base = pkg?.base_price
  const currency = pkg?.currency || 'USD'
  const symbol = currency === 'USD' ? '$' : currency
  const onSale =
    pkg?.sale?.active ||
    (pkg?.total_price != null && pkg?.base_price != null && pkg.total_price < pkg.base_price)
  return { symbol, sale, base, onSale }
}

function discountPct(pkg) {
  if (!pkg?.base_price || !pkg?.total_price) return 0
  if (pkg.total_price >= pkg.base_price) return 0
  return Math.round(((pkg.base_price - pkg.total_price) / pkg.base_price) * 100)
}

export default function PackageCard({ pkg, onOpen }) {
  const [busy, setBusy] = useState(false)
  const { symbol, sale, base, onSale } = formatPrice(pkg)
  const pct = discountPct(pkg)
  const img = pkg?.image || '/images/placeholder.svg'

  const handleBuy = async (e) => {
    e.stopPropagation()
    try {
      setBusy(true)
      const url = await buyPackage(pkg.id)
      if (url) window.location.href = url
    } catch (err) {
      alert('שגיאה ביצירת תשלום: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card fade-in cursor-pointer group" onClick={() => onOpen?.(pkg)}>
      <div className="relative aspect-[4/3] bg-gradient-to-br from-bg-panel to-black overflow-hidden">
        {pct > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-glow">
            {pct}% OFF
          </span>
        )}
        <img
          src={img}
          alt={pkg.name}
          loading="lazy"
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = '/images/placeholder.svg' }}
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-white font-bold text-lg truncate">{pkg.name}</h3>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            {onSale && base != null && (
              <span className="text-gray-500 line-through text-sm">{symbol}{Number(base).toFixed(2)}</span>
            )}
            <span className="text-brand text-2xl font-extrabold">{symbol}{Number(sale).toFixed(2)}</span>
          </div>
          <button
            disabled={busy}
            onClick={handleBuy}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? '...טוען' : 'קנייה'}
          </button>
        </div>
      </div>
    </div>
  )
}
