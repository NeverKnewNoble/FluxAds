import Reveal from './Reveal'
import { services } from './content'

export default function Services() {
  return (
    <section id="services" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <span className="eyebrow">What we do</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tight text-cream">
                Everything your campaign needs,{' '}
                <span className="text-cream-dim">generated and refined.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-xs text-cream-dim">
              One studio for stills, motion and restoration — built to move at
              the speed of your launch calendar.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.no} delay={i * 80} as="article">
              <article className="group h-full bg-ink p-8 transition-colors duration-300 hover:bg-ink-card md:p-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm text-flux-deep">
                    {s.no}
                  </span>
                  <span className="text-cream-dim opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                    →
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-cream">
                  {s.title}
                </h3>
                <p className="mt-3 text-cream-dim">{s.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
