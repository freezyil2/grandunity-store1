import { useEffect, useState } from 'react'

const DISCORD_INVITE = import.meta.env.VITE_DISCORD_INVITE || 'https://discord.gg/grandunity'
const SERVER_STATUS_URL = import.meta.env.VITE_SERVER_STATUS_URL
const FIVEM_SERVER_ID = import.meta.env.VITE_FIVEM_SERVER_ID

async function fetchServerStatus() {
  // Option A: custom endpoint (recommended)
  // Expected JSON (example):
  // { "online": true, "players": 128, "maxPlayers": 256, "name": "GrandUnity RP" }
  if (SERVER_STATUS_URL) {
    const res = await fetch(SERVER_STATUS_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error('status_fetch_failed')
    const data = await res.json()
    return {
      online: Boolean(data?.online),
      players: Number.isFinite(Number(data?.players)) ? Number(data.players) : null,
      maxPlayers: Number.isFinite(Number(data?.maxPlayers)) ? Number(data.maxPlayers) : null,
      name: data?.name ? String(data.name) : null,
    }
  }

  // Option B: FiveM public API (needs server id)
  if (FIVEM_SERVER_ID) {
    const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${FIVEM_SERVER_ID}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('status_fetch_failed')
    const data = await res.json()
    const d = data?.Data
    return {
      online: true,
      players: Number.isFinite(Number(d?.clients)) ? Number(d.clients) : null,
      maxPlayers: Number.isFinite(Number(d?.sv_maxclients)) ? Number(d.sv_maxclients) : null,
      name: d?.hostname ? String(d.hostname) : null,
    }
  }

  return null
}

export default function Hero() {
  const [members, setMembers] = useState(0)
  const [server, setServer] = useState({ state: 'idle', online: false, players: null, maxPlayers: null, name: null })

  // Try to fetch live member count from Discord widget (works only if widget is enabled)
  useEffect(() => {
    const inviteCode = DISCORD_INVITE.split('/').pop()
    fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.approximate_member_count && setMembers(d.approximate_member_count))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let alive = true
    let t = 0

    const tick = async () => {
      try {
        if (!alive) return
        setServer((s) => ({ ...s, state: 'loading' }))
        const next = await fetchServerStatus()
        if (!alive) return
        if (!next) {
          setServer({ state: 'unconfigured', online: false, players: null, maxPlayers: null, name: null })
          return
        }
        setServer({ state: 'ready', ...next })
      } catch {
        if (!alive) return
        setServer({ state: 'error', online: false, players: null, maxPlayers: null, name: null })
      }
    }

    tick()
    t = window.setInterval(tick, 15000)
    return () => {
      alive = false
      window.clearInterval(t)
    }
  }, [])

  return (
    <section className="relative">
      {/* glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/20 rounded-full blur-[120px]" />
        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-brand-light/60 animate-pulse" />
        <div className="absolute top-32 right-20 w-1.5 h-1.5 rounded-full bg-brand-glow/70 animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-1 h-1 rounded-full bg-brand-light/50 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-brand/60 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* Left card - server status */}
          <div className="group flex items-center gap-3 bg-bg-card/80 border border-bg-border hover:border-brand/60 rounded-xl p-3 transition shadow-lg backdrop-blur">
            <span
              className={`flex items-center justify-center w-12 h-12 rounded-lg text-white text-xl shadow-glow ${
                server.state === 'ready' && server.online
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                  : server.state === 'loading'
                    ? 'bg-brand/20 text-brand-light'
                    : 'bg-rose-500/15 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
              }`}
              aria-hidden="true"
            >
              {server.state === 'loading' ? '…' : server.state === 'ready' && server.online ? '●' : '○'}
            </span>
            <span className="text-right flex-1 min-w-0">
              <span className="flex items-center gap-2 justify-start">
                <span className="font-extrabold text-white text-lg">
                  סטטוס שרת
                </span>
                <span className="text-xs bg-brand/20 text-brand-light px-2 py-0.5 rounded-md font-semibold">
                  LIVE
                </span>
              </span>
              <span className="block text-[11px] text-gray-400 tracking-widest uppercase">
                {server.state === 'unconfigured'
                  ? 'NOT CONFIGURED'
                  : server.state === 'loading'
                    ? 'CHECKING…'
                    : server.state === 'ready' && server.online
                      ? `ONLINE${server.players != null ? ` • ${server.players}${server.maxPlayers ? `/${server.maxPlayers}` : ''}` : ''}`
                      : 'OFFLINE'}
              </span>
            </span>
          </div>

          {/* Center logo */}
          <div className="flex justify-center order-first md:order-none">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/30 rounded-full blur-3xl scale-110" />
              <img
                src="/images/logo.png"
                alt="GrandUnity RP"
                className="relative w-44 md:w-56 h-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>

          {/* Right card - discord */}
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 bg-bg-card/80 border border-bg-border hover:border-brand/60 rounded-xl p-3 transition shadow-lg backdrop-blur md:flex-row-reverse"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand text-white text-xl shadow-glow">
              ✱
            </span>
            <span className="text-left flex-1 md:text-right">
              <span className="flex items-center gap-2 justify-end">
                <span className="text-xs bg-brand/20 text-brand-light px-2 py-0.5 rounded-md font-semibold">
                  {members ? members.toLocaleString() : '—'}
                </span>
                <span className="font-extrabold text-white text-lg">OUR DISCORD</span>
              </span>
              <span className="block text-[11px] text-gray-400 tracking-widest">CLICK TO JOIN</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
