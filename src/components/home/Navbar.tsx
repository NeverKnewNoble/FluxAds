import { useEffect, useState } from 'react'
import { WHATSAPP_LINK } from './content'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
      <nav
        className={`mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 rounded-full pl-5 pr-2 transition-all duration-300 ${
          scrolled
            ? 'border border-line bg-ink/70 shadow-[0_12px_40px_-16px_rgba(23,18,12,0.4)] backdrop-blur-xl'
            : 'border border-line/60 bg-ink/40 backdrop-blur-md'
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="font-display text-lg font-semibold tracking-tight text-cream">
            Flux<span className="text-flux"> Ads</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-cream-dim transition-colors hover:text-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-flux px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-6px_rgba(139,105,49,0.45)]"
        >
          Text us
        </a>
      </nav>
    </header>
  )
}
