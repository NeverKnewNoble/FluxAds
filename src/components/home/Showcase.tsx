import { useState } from 'react'
import Reveal from './Reveal'
import Lightbox from './Lightbox'
import { WHATSAPP_LINK, type Work } from './content'

type Filter = 'all' | 'image' | 'video'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All work' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
]

export default function Showcase({ works }: { works: Work[] }) {
  const [active, setActive] = useState<Filter>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const shown = works.filter((w) => active === 'all' || w.type === active)

  const selectFilter = (key: Filter) => {
    setOpenIndex(null)
    setActive(key)
  }

  return (
    <section id="work" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <span className="eyebrow">Our work so far</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tight text-cream">
                Everything we've made{' '}
                <span className="text-cream-dim">— images &amp; videos.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="inline-flex rounded-full border border-line p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => selectFilter(f.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active === f.key
                      ? 'bg-flux text-ink'
                      : 'text-cream-dim hover:text-cream'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Masonry via CSS columns */}
        <div className="mt-14 gap-5 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
          {shown.map((w, i) => (
            <Tile key={w.id} work={w} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-12 text-center text-sm text-cream-dim">
            Every frame above is AI-generated and human-directed by Flux Ads.{' '}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-flux hover:underline"
            >
              Want yours next? Text us →
            </a>
          </p>
        </Reveal>
      </div>

      {openIndex !== null && (
        <Lightbox
          items={shown}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </section>
  )
}

function Tile({
  work,
  index,
  onOpen,
}: {
  work: Work
  index: number
  onOpen: () => void
}) {
  return (
    <Reveal
      delay={(index % 3) * 90}
      className="mb-5 break-inside-avoid"
      as="article"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Enlarge: ${work.title}`}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-ink-card text-left shadow-[0_18px_40px_-24px_rgba(23,18,12,0.55)] ring-1 ring-transparent transition duration-500 hover:shadow-[0_30px_60px_-28px_rgba(23,18,12,0.7)] hover:ring-flux/30"
      >
        <div className={`relative w-full ${work.aspect}`}>
          {work.type === 'image' ? (
            <img
              src={work.src}
              alt={work.title}
              loading="lazy"
              decoding="async"
              className={`w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                work.aspect ? 'h-full object-cover' : 'block h-auto'
              }`}
            />
          ) : (
            <video
              src={work.src}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className={`w-full ${work.aspect ? 'h-full object-cover' : 'block h-auto'}`}
            />
          )}

          {work.type === 'video' && (
            <span className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[#f7ebe0] backdrop-blur-sm">
              <span className="border-y-[4px] border-l-[7px] border-y-transparent border-l-flux" />
              Video
            </span>
          )}

          {/* Expand hint */}
          <span className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-[#f7ebe0] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* Permanent base shade + hover meta (light text over the photo) */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/15 to-transparent p-5 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[#dcb87f]">
              {work.category}
            </span>
            <h3 className="mt-1.5 font-display text-xl font-medium text-[#f7ebe0]">
              {work.title}
            </h3>
          </div>
        </div>
      </button>
    </Reveal>
  )
}
