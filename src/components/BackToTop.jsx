import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop || 0
        setShow(y > 700)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed z-[60] bottom-5 left-5 md:bottom-7 md:left-7 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card/80 backdrop-blur border border-bg-border hover:border-brand/60 text-white shadow-xl transition hover:-translate-y-0.5"
      aria-label="חזרה למעלה"
    >
      <span className="w-8 h-8 rounded-lg bg-brand/20 text-brand-light flex items-center justify-center font-bold">
        ↑
      </span>
      <span className="text-sm font-bold">למעלה</span>
    </button>
  )
}

