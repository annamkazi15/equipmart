import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../data/DataContext'
import type { ListingType } from '../types'

interface Suggestion {
  id: string
  primary: string
  secondary: string
  to: string
}

interface SearchBarProps {
  listingType: ListingType
}

export function SearchBar({ listingType }: SearchBarProps) {
  const { products, categoryGroups } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return [] as Suggestion[]

    const items: Suggestion[] = []

    for (const group of categoryGroups) {
      if (group.listingType !== listingType) continue
      for (const sub of group.subcategories) {
        if (
          sub.name.toLowerCase().includes(q) ||
          group.name.toLowerCase().includes(q) ||
          sub.slug.toLowerCase().includes(q)
        ) {
          items.push({
            id: `svc-${sub.id}`,
            primary: `${sub.name} • ${group.name}`,
            secondary: `${sub.slug} • ${sub.count} listings`,
            to: `/category/${sub.slug}`,
          })
        }
      }
    }

    for (const p of products) {
      if (p.listingType !== listingType) continue
      if (
        p.itemName.toLowerCase().includes(q) ||
        p.itemCode.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.itemCategory.toLowerCase().includes(q)
      ) {
        items.push({
          id: `p-${p.id}`,
          primary: `${p.itemName} • ${p.location || p.companyLocation}`,
          secondary: `${p.itemCode} • ${p.company}`,
          to: `/product/${p.id}`,
        })
      }
    }

    return items.slice(0, 8)
  }, [query, products, categoryGroups, listingType])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  function goSearch() {
    const search = new URLSearchParams()
    if (query.trim()) search.set('q', query.trim())
    search.set('type', listingType)
    setOpen(false)
    navigate(`/search?${search.toString()}`)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(suggestions[activeIndex].to)
      setOpen(false)
      return
    }
    goSearch()
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  function clearQuery() {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div className="search-bar" ref={rootRef}>
      <form className="search-bar__form" onSubmit={onSubmit} role="search">
        <span className="search-bar__icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          placeholder="Search machines, categories, brands..."
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="search-suggestions"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={clearQuery}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </form>

      {open && query.trim() && (
        <div className="search-bar__dropdown" id="search-suggestions" role="listbox">
          {suggestions.length === 0 ? (
            <div className="search-bar__empty">No matches found</div>
          ) : (
            suggestions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`search-bar__item${index === activeIndex ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  navigate(item.to)
                  setOpen(false)
                }}
              >
                <span className="search-bar__primary">{item.primary}</span>
                <span className="search-bar__secondary">{item.secondary}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
