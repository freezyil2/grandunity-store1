import { useEffect, useState } from 'react'

const TOKEN = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN

async function fetchPayments() {
  try {
    // Tebex public listing endpoint (recent payments) — may require store config to be public.
    const res = await fetch(`https://plugin.tebex.io/payments?limit=10`, {
      headers: { 'X-Tebex-Secret': '' },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default function Sidebar() {
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetchPayments().then((data) => Array.isArray(data) && setRecent(data.slice(0, 5)))
  }, [])

  // Demo placeholders if API isn't reachable from frontend
  const demoPayments = [
    { id: 1, name: 'avivthapro', pkg: 'GANG SLOT I', time: 'Today 16:14', color: 'bg-blue-500' },
    { id: 2, name: 'ofekshomron', pkg: 'PR Sub', time: 'Today 16:01', color: 'bg-green-500' },
    { id: 3, name: 'MrLucky_1', pkg: 'Unban 0-2 days', time: 'Today 14:15', color: 'bg-pink-500' },
    { id: 4, name: 'noamx', pkg: 'Money Pack II', time: 'Today 12:42', color: 'bg-amber-500' },
    { id: 5, name: 'shaked99', pkg: 'PR Royal', time: 'Yesterday 22:08', color: 'bg-purple-500' },
  ]
  const list = recent.length > 0
    ? recent.map((p, i) => ({
        id: p.id || i,
        name: p.player?.name || p.name || 'player',
        pkg: p.packages?.[0]?.name || 'Package',
        time: p.date || '',
        color: ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-amber-500', 'bg-purple-500'][i % 5],
      }))
    : demoPayments

  return (
    <aside className="space-y-5">
      {/* Top customer */}
      <div className="bg-bg-card/80 backdrop-blur border border-bg-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-glow">
            🏆
          </div>
          <h3 className="text-white font-extrabold tracking-wide text-lg">TOP CUSTOMER</h3>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-brand/40 bg-brand/5">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold">
            D
          </div>
          <div className="flex-1">
            <div className="font-bold text-white">topplayer</div>
            <div className="text-[11px] text-gray-400 tracking-widest">DONATED THE MOST THIS WEEK</div>
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-bg-card/80 backdrop-blur border border-bg-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-glow">
            ☰
          </div>
          <h3 className="text-white font-extrabold tracking-wide text-lg">RECENT PAYMENTS</h3>
        </div>
        <ul className="space-y-2">
          {list.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-border/50 transition"
            >
              <div className={`w-9 h-9 rounded-md ${p.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {p.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-gray-500 mx-1.5">•</span>
                  <span className="text-gray-300">{p.pkg}</span>
                </div>
                <div className="text-[11px] text-gray-500">{p.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
