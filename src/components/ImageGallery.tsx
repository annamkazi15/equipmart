import { useCallback, useEffect, useState } from 'react'

export function ImageGallery({
  images,
  alt,
  onManageImages,
}: {
  images: string[]
  alt: string
  onManageImages?: () => void
}) {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const current = images[active] ?? images[0]
  const label = alt || 'product image'
  const hasPrev = active > 0
  const hasNext = active < images.length - 1

  const goPrev = useCallback(() => {
    setActive((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setActive((i) => Math.min(images.length - 1, i + 1))
  }, [images.length])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Escape') {
        return
      }

      const target = e.target as HTMLElement | null
      const inTextField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (e.key === 'Escape') {
        if (expanded) {
          e.preventDefault()
          setExpanded(false)
        }
        return
      }

      if (inTextField && !expanded) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded, goPrev, goNext])

  useEffect(() => {
    if (!expanded) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [expanded])

  if (!current) return null

  function select(i: number) {
    setActive(i)
  }

  function openExpanded() {
    setExpanded(true)
  }

  function closeExpanded() {
    setExpanded(false)
  }

  return (
    <>
      <div className="gallery">
        <div className="gallery__body">
          <div className="gallery__main-wrap">
            <div
              className="gallery__main gallery__main--expandable"
              onClick={openExpanded}
              role="button"
              tabIndex={0}
              aria-label={`View larger ${label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openExpanded()
                }
              }}
            >
              <img src={current} alt={alt} draggable={false} />

              {onManageImages && (
                <button
                  type="button"
                  className="gallery__control gallery__control--camera"
                  onClick={(e) => {
                    e.stopPropagation()
                    onManageImages()
                  }}
                  aria-label="Manage images"
                  title="Manage images"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 7h3l1.5-2h7L17 7h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="13"
                      r="3.2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="gallery__thumbs">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={i === active ? 'active' : undefined}
                  onClick={() => select(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div
          className="gallery-lightbox"
          onClick={closeExpanded}
          role="presentation"
        >
          <div className="gallery-lightbox__backdrop" aria-hidden />
          <div
            className="gallery-lightbox__stage"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${label} — image ${active + 1} of ${images.length}`}
          >
            <div className="gallery-lightbox__viewer">
              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  disabled={!hasPrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}

              <div className="gallery-lightbox__frame">
                <img
                  src={current}
                  alt={alt}
                  className="gallery-lightbox__img"
                  draggable={false}
                />
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  disabled={!hasNext}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>

            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeExpanded}
              aria-label="Close larger view"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
