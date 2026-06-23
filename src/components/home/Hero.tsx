import Reveal from './Reveal'
import { WHATSAPP_LINK, heroTiles, type HeroTile } from './content'

export default function Hero() {
  // The hero collage is intentionally fixed/curated — only the gallery below is
  // live from Blob.
  const tiles = heroTiles

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28"
    >
      {/* Atmosphere */}
      <div className="gridlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="bloom pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-8 bg-flux-deep" />
              AI Creative Studio
            </span>
          </Reveal>

          <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-cream">
            <Reveal delay={60} as="span" className="block">
              AI-Powered Ads
            </Reveal>
            <Reveal delay={140} as="span" className="block">
              <em className="font-light italic text-flux">Content</em> Creation
            </Reveal>
          </h1>

          <Reveal delay={240}>
            <p className="mt-7 max-w-xl text-lg text-cream-dim">
              Studio-grade images and video for product, food, e-commerce,
              beauty &amp; fashion, and advertising. Just text us what you want —
              we shape it through a quick chat, create it with AI, and deliver
              on your timeline.
            </p>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-flux px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(139,105,49,0.5)]"
              >
                Text us now
              </a>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-cream/40 hover:bg-cream/5"
              >
                See our work
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={440}>
            <p className="eyebrow mt-10 text-cream-dim/70">
              Text → we create → delivered on time
            </p>
          </Reveal>
        </div>

        {/* Floating visual cluster — real Flux Ads work */}
        <Reveal delay={200} className="relative hidden h-[680px] lg:block">
          <FloatTile
            className="absolute right-2 top-0 w-72 animate-float xl:w-80"
            aspect="aspect-[3/4]"
            tile={tiles[0]}
          />
          <FloatTile
            className="absolute left-0 top-40 w-60 animate-float [animation-delay:-2.5s] xl:w-64"
            aspect="aspect-[9/16]"
            tile={tiles[1]}
          />
          <FloatTile
            className="absolute bottom-0 right-20 w-52 animate-float [animation-delay:-4.5s] xl:w-56"
            aspect="aspect-[9/16]"
            tile={tiles[2]}
          />
        </Reveal>
      </div>
    </section>
  )
}

function FloatTile({
  className = '',
  aspect,
  tile,
}: {
  className?: string
  aspect: string
  tile?: HeroTile
}) {
  if (!tile) return null
  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-line shadow-[0_36px_70px_-26px_rgba(23,18,12,0.55)] ${className}`}
    >
      <div className={`relative ${aspect} w-full bg-ink-card`}>
        {tile.type === 'image' ? (
          <img
            src={tile.src}
            alt={tile.tag}
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={tile.src}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="h-full w-full object-cover"
          />
        )}
        {tile.tag && (
          <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[#f7ebe0]">
              {tile.tag}
            </span>
          </figcaption>
        )}
      </div>
    </figure>
  )
}
