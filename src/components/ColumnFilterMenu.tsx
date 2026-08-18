import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ColumnSortKind, SortDirection } from '../data/companyTable'

function SortAscIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 3l3.5 4H4.5L8 3z" />
      <path d="M5 8.5h6v1H5v-1z" opacity="0.45" />
      <path d="M6 11h4v1H6v-1z" opacity="0.3" />
    </svg>
  )
}

function SortDescIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M6 4h4v1H6V4z" opacity="0.3" />
      <path d="M5 6.5h6v1H5v-1z" opacity="0.45" />
      <path d="M8 13l3.5-4H4.5L8 13z" />
    </svg>
  )
}

export function ColumnFilterMenu({
  columnLabel,
  values,
  sortKind = 'text',
  appliedSelection,
  appliedSort,
  anchorEl,
  onApply,
  onSort,
  onClearFilter,
  onClearSort,
  onClose,
}: {
  columnLabel: string
  values: string[]
  sortKind?: ColumnSortKind
  appliedSelection: Set<string> | null
  appliedSort: SortDirection | null
  anchorEl: HTMLElement | null
  onApply: (selection: Set<string> | null) => void
  onSort: (direction: SortDirection) => void
  onClearFilter: () => void
  onClearSort: () => void
  onClose: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState<Set<string>>(
    () => new Set(appliedSelection ?? values),
  )
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  )

  const filteredValues = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return values
    return values.filter((v) => v.toLowerCase().includes(q))
  }, [search, values])

  const allFilteredSelected =
    filteredValues.length > 0 && filteredValues.every((v) => draft.has(v))
  const someFilteredSelected = filteredValues.some((v) => draft.has(v))
  const filterActive =
    appliedSelection !== null && appliedSelection.size < values.length

  const sortAscLabel =
    sortKind === 'numeric' ? 'Sort Smallest to Largest' : 'Sort A to Z'
  const sortDescLabel =
    sortKind === 'numeric' ? 'Sort Largest to Smallest' : 'Sort Z to A'

  useLayoutEffect(() => {
    function updatePosition() {
      if (!anchorEl || !menuRef.current) return

      const anchorRect = anchorEl.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const margin = 8

      let top = anchorRect.bottom + 4
      let left = anchorRect.left

      if (left + menuRect.width > window.innerWidth - margin) {
        left = window.innerWidth - menuRect.width - margin
      }
      if (left < margin) left = margin

      if (top + menuRect.height > window.innerHeight - margin) {
        top = anchorRect.top - menuRect.height - 4
      }
      if (top < margin) top = margin

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchorEl, filterActive, values.length, appliedSort])

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if (anchorEl?.contains(target)) return
      onClose()
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [anchorEl, onClose])

  function toggleValue(value: string) {
    setDraft((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function toggleSelectAllFiltered() {
    setDraft((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected) {
        filteredValues.forEach((v) => next.delete(v))
      } else {
        filteredValues.forEach((v) => next.add(v))
      }
      return next
    })
  }

  function handleApply() {
    if (draft.size === 0) {
      onApply(new Set())
    } else if (draft.size >= values.length) {
      onApply(null)
    } else {
      onApply(new Set(draft))
    }
    onClose()
  }

  function handleSort(direction: SortDirection) {
    onSort(direction)
    onClose()
  }

  const menu = (
    <div
      ref={menuRef}
      className="col-filter-menu col-filter-menu--fixed"
      role="dialog"
      aria-label={`Filter ${columnLabel}`}
      style={
        position
          ? { top: `${position.top}px`, left: `${position.left}px` }
          : { visibility: 'hidden' }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <div className="col-filter-menu__sort">
        <button
          type="button"
          className={`col-filter-menu__sort-btn${appliedSort === 'asc' ? ' active' : ''}`}
          onClick={() => handleSort('asc')}
        >
          <SortAscIcon />
          <span>{sortAscLabel}</span>
        </button>
        <button
          type="button"
          className={`col-filter-menu__sort-btn${appliedSort === 'desc' ? ' active' : ''}`}
          onClick={() => handleSort('desc')}
        >
          <SortDescIcon />
          <span>{sortDescLabel}</span>
        </button>
        {appliedSort && (
          <button type="button" className="col-filter-menu__sort-clear" onClick={onClearSort}>
            Clear sort
          </button>
        )}
      </div>

      {filterActive && (
        <button type="button" className="col-filter-menu__clear" onClick={onClearFilter}>
          Clear filter from &ldquo;{columnLabel}&rdquo;
        </button>
      )}

      <div className="col-filter-menu__search">
        <input
          type="text"
          value={search}
          placeholder="Search"
          aria-label={`Search ${columnLabel} values`}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <label className="col-filter-menu__option col-filter-menu__option--all">
        <input
          type="checkbox"
          checked={allFilteredSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = someFilteredSelected && !allFilteredSelected
            }
          }}
          onChange={toggleSelectAllFiltered}
        />
        <span>Select All</span>
      </label>

      <div className="col-filter-menu__list" role="listbox">
        {filteredValues.length === 0 ? (
          <div className="col-filter-menu__empty">No matches</div>
        ) : (
          filteredValues.map((value) => (
            <label key={value} className="col-filter-menu__option">
              <input
                type="checkbox"
                checked={draft.has(value)}
                onChange={() => toggleValue(value)}
              />
              <span>{value}</span>
            </label>
          ))
        )}
      </div>

      <div className="col-filter-menu__actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="primary" onClick={handleApply}>
          OK
        </button>
      </div>
    </div>
  )

  return createPortal(menu, document.body)
}
