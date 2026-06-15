import { useEffect } from 'react'
import type { Work } from './content'

type LightboxProps = {
  items: Work[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
}

/**
 * Full-screen viewer for the gallery. Open by clicking a tile; navigate with
 * the on-screen arrows or ← / → keys; close with Esc, the ✕, or a backdrop click.
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const item = items[index]
  const many = items.length > 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft')
        onIndexChange((index - 1 + items.length) % items.length)
      else if (e.key === 'ArrowRight')
        onIndexChange((index + 1) % items.length)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index, items.length, onClose, onIndexChange])

  if (!item) return null

  const go = (dir: number) =>
    onIndexChange((index + dir + items.length) % items.length)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="animate-fade fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#f7ebe0] transition-colors hover:border-flux/60 hover:text-flux sm:right-6 sm:top-6"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev / Next */}
      {many && (
        <>
          <NavButton dir="prev" onClick={(e) => { e.stopPropagation(); go(-1) }} />
          <NavButton dir="next" onClick={(e) => { e.stopPropagation(); go(1) }} />
        </>
      )}

      {/* Media + caption */}
      <figure
        key={item.id}
        onClick={(e) => e.stopPropagation()}
        className="animate-zoom flex max-h-full max-w-full flex-col items-center"
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt={item.title}
            decoding="async"
            className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
          />
        ) : (
          <video
            src={item.src}
            controls
            autoPlay
            loop
            playsInline
            muted
            className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
          />
        )}

        <figcaption className="mt-5 flex items-center gap-4 text-center">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#dcb87f]">
            {item.category}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-display text-lg text-[#f7ebe0]">
            {item.title}
          </span>
          {many && (
            <span className="font-mono text-xs text-white/40">
              {index + 1}/{items.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  )
}

function NavButton({
  dir,
  onClick,
}: {
  dir: 'prev' | 'next'
  onClick: (e: React.MouseEvent) => void
}) {
  const prev = dir === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? 'Previous' : 'Next'}
      className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-[#f7ebe0] transition-colors hover:border-flux/60 hover:text-flux ${
        prev ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={prev ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
