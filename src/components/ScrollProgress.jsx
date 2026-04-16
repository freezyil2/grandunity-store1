import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollTop = doc.scrollTop || document.body.scrollTop || 0
        const scrollHeight = doc.scrollHeight || 0
        const clientHeight = doc.clientHeight || 0
        const max = Math.max(1, scrollHeight - clientHeight)
        setPct(Math.min(100, Math.max(0, (scrollTop / max) * 100)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand via-brand-glow to-brand-light shadow-glow"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

