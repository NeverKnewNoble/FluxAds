import { WHATSAPP_LINK, WHATSAPP_DISPLAY, TIKTOK_LINK } from './content'

const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'Contact', href: '#contact' },
]

const social = [
  { label: 'TikTok', href: TIKTOK_LINK },
  { label: `WhatsApp ${WHATSAPP_DISPLAY}`, href: WHATSAPP_LINK },
]

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-14 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="font-display text-lg font-semibold text-cream">
                Flux<span className="text-flux"> Ads</span>
              </span>
            </a>
            <p className="mt-4 text-sm text-cream-dim">
              AI-powered ad content creation — product, food, e-commerce, beauty
              &amp; fashion, advertising. Generated with AI, directed by humans.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-2">
            <div>
              <h4 className="eyebrow text-cream-dim">Explore</h4>
              <ul className="mt-4 space-y-2.5">
                {nav.map((l) => (
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
            </div>
            <div>
              <h4 className="eyebrow text-cream-dim">Social</h4>
              <ul className="mt-4 space-y-2.5">
                {social.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cream-dim transition-colors hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-cream-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Flux Ads. All rights reserved.</span>
          <span className="font-mono text-xs tracking-widest text-cream-dim/70">
            BUILT FOR BRANDS THAT MOVE
          </span>
        </div>
      </div>
    </footer>
  )
}
