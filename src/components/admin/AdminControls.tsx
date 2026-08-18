import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export function AdminPlusButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="admin-icon-btn admin-icon-btn--add"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      title={label}
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 3v10M3 8h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

export function AdminEditButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="admin-icon-btn admin-icon-btn--edit"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      title={label}
      aria-label={label}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 6.5l3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

export function AdminModal({
  title,
  children,
  onClose,
  onSave,
  onDelete,
  saveLabel = 'Save',
  size = 'md',
}: {
  title: string
  children: ReactNode
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
  saveLabel?: string
  /** sm: few short fields · md: standard forms · lg: row editors / image grids */
  size?: 'sm' | 'md' | 'lg'
}) {
  return createPortal(
    <div className="admin-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="admin-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className={`admin-modal__panel admin-modal__panel--${size}`}>
        <div className="admin-modal__head">
          <h2>{title}</h2>
          <button type="button" className="admin-modal__x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
        <div className="admin-modal__foot">
          {onDelete && (
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <div className="admin-modal__foot-right">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn" onClick={onSave}>
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label
      className={['admin-modal__field', className].filter(Boolean).join(' ')}
    >
      <span>{label}</span>
      {children}
    </label>
  )
}

/** URL-friendly id used in links, generated from the display name */
export function toSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `item-${Date.now()}`
  )
}
