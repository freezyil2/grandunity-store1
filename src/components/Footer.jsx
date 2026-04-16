export default function Footer() {
  return (
    <footer className="border-t border-bg-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt=""
            className="w-7 h-7 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <span>© {new Date().getFullYear()} GrandUnity RP — כל הזכויות שמורות.</span>
        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href={import.meta.env.VITE_DISCORD_INVITE || '#'} target="_blank" rel="noreferrer">Discord</a>
          <span className="opacity-50">·</span>
          <span>Powered by Tebex</span>
        </div>
      </div>
    </footer>
  )
}
