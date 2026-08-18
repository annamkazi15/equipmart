import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { CategoryGroup } from '../types'
import { HomeToolbar } from './HomeToolbar'

function CarouselNav({ onScroll }: { onScroll: (dir: -1 | 1) => void }) {
  return (
    <div className="carousel-nav">
      <button
        type="button"
        className="carousel-nav__btn"
        onClick={() => onScroll(-1)}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-nav__btn"
        onClick={() => onScroll(1)}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  )
}

export function CategorySection({
  group,
  leadSection = false,
  onOpenAddHub,
}: {
  group: CategoryGroup
  leadSection?: boolean
  onOpenAddHub?: () => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <section className="category-section category-section--flat">
      {leadSection && (
        <div className="category-section__site-toolbar">
          <HomeToolbar onAddClick={onOpenAddHub} />
        </div>
      )}

      <div className="category-section__head">
        <div className="category-section__title">
          <h3>{group.name}</h3>
        </div>
        <CarouselNav onScroll={scrollBy} />
      </div>

      <div className="service-carousel" ref={scrollerRef}>
        {group.subcategories.map((sub) => (
          <div key={sub.id} className="subcategory-wrap">
            <Link to={`/category/${sub.slug}`} className="subcategory-item">
              <img
                className="subcategory-item__img"
                src={sub.image}
                alt={sub.name}
                loading="lazy"
              />
              <span className="subcategory-item__name">{sub.name}</span>
              <span className="subcategory-item__count">({sub.count})</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
