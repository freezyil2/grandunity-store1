import { useEffect, useState } from 'react'

const DISCORD_INVITE = import.meta.env.VITE_DISCORD_INVITE || 'https://discord.gg/grandunity'
const COPY_TAG = 'GRRP'

export default function Hero() {
  const [members, setMembers] = useState(0)
  const [copied, setCopied] = useState(false)

  // Try to fetch live member count from Discord widget (works only if widget is enabled)
  useEffect(() => {
    const inviteCode = DISCORD_INVITE.split('/').pop()
    fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.approximate_member_count && setMembers(d.approximate_member_count))
      .catch(() => {})
  }, [])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(COPY_TAG)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

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
          {/* Left card - copy tag */}
          <button
            onClick={onCopy}
            className="group flex items-center gap-3 bg-bg-card/80 border border-bg-border hover:border-brand/60 rounded-xl p-3 transition shadow-lg backdrop-blur"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand text-white text-xl shadow-glow">
              ▶
            </span>
            <span className="text-right flex-1">
              <span className="flex items-center gap-2 justify-start">
                <span className="font-extrabold text-white text-lg">{COPY_TAG}</span>
                <span className="text-xs bg-brand/20 text-brand-light px-2 py-0.5 rounded-md font-semibold">
                  0
                </span>
              </span>
              <span className="block text-[11px] text-gray-400 tracking-widest">
                {copied ? 'COPIED!' : 'CLICK TO COPY'}
              </span>
            </span>
          </button>

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
