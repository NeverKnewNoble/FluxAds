import Reveal from './Reveal'
import { categories } from './content'

export default function Categories() {
  return (
    <section
      id="specialties"
      className="relative border-y border-line bg-ink-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="bloom pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 opacity-50" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <span className="eyebrow">Where we specialise</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tight text-cream">
            Five fields, one obsession with craft.
          </h2>
        </Reveal>

        <ul className="mt-14 border-t border-line">
          {categories.map((c, i) => (
            <Reveal key={c.label} delay={i * 60} as="li">
              <li className="group grid grid-cols-1 items-center gap-2 border-b border-line py-7 transition-colors duration-300 hover:bg-ink/60 md:grid-cols-[auto_1fr_auto] md:gap-10 md:px-4">
                <span className="font-mono text-sm text-flux-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-3xl font-medium text-cream transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {c.label}
                </h3>
                <p className="max-w-sm text-cream-dim md:text-right">{c.copy}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
