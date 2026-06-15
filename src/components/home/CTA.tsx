import Reveal from './Reveal'
import { WHATSAPP_LINK, WHATSAPP_DISPLAY, TIKTOK_LINK } from './content'

const flow = [
  { no: '01', label: 'You text us', copy: 'Tell us what you want to create.' },
  { no: '02', label: 'We create it', copy: 'We shape it over chat and make it with AI.' },
  { no: '03', label: 'Delivered', copy: 'Final images & videos, on your timeline.' },
]

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-28 md:px-10 md:py-40"
    >
      <div className="bloom pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2" />

      <Reveal className="relative mx-auto max-w-4xl text-center">
        <span className="eyebrow">Let's create</span>
        <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-cream">
          Ready to make ads that{' '}
          <em className="font-light italic text-flux">stop the scroll?</em>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg text-cream-dim">
          No long forms. Just text us what you have in mind — we work out the
          details over chat, create it, and deliver on time.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-flux px-8 py-4 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_44px_-8px_rgba(139,105,49,0.55)]"
          >
            Text us now
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-8 py-4 text-sm font-semibold text-cream transition-colors hover:border-cream/40 hover:bg-cream/5"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>

        {/* How it works in three quick beats */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {flow.map((f) => (
            <div key={f.no} className="bg-ink px-6 py-7 text-left">
              <span className="font-mono text-sm text-flux">{f.no}</span>
              <h3 className="mt-3 font-display text-xl font-medium text-cream">
                {f.label}
              </h3>
              <p className="mt-1.5 text-sm text-cream-dim">{f.copy}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-cream-dim">
          Prefer to see more first?{' '}
          <a
            href={TIKTOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-flux hover:underline"
          >
            Watch our work on TikTok →
          </a>
        </p>
      </Reveal>
    </section>
  )
}
