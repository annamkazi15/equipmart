import type { ReactNode } from 'react'
import type { ListingType } from '../../types'
import { PageTopbar } from '../PageTopbar'

export function AdminFormPage({
  title,
  subtitle,
  listingType,
  onCancel,
  onSave,
  saveLabel = 'Save',
  children,
}: {
  title: string
  subtitle?: string
  listingType: ListingType
  onCancel: () => void
  onSave: () => void
  saveLabel?: string
  children: ReactNode
}) {
  return (
    <div className="page page--admin-form">
      <PageTopbar listingType={listingType} />

      <div className="admin-form-page">
        <header className="admin-form-page__head">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </header>

        <div className="admin-form-page__body">{children}</div>

        <footer className="admin-form-page__foot">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="button" className="admin-btn" onClick={onSave}>
            {saveLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
