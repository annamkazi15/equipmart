import { useState } from 'react'
import type {
  DetailSection,
  FieldRow,
  ListingType,
  Product,
} from '../../types'
import { createEmptyRow, createEmptySection, createId } from '../../data/normalize'
import { buildBlankProduct } from '../../data/DataContext'
import { AdminModal, Field } from './AdminControls'

export function useProductFormState(options: {
  initial?: Product
  defaultListingType: ListingType
  defaultSubcategorySlug?: string
  defaultCategoryLabel?: string
}) {
  const { initial, defaultListingType, defaultSubcategorySlug, defaultCategoryLabel } =
    options
  const blank = buildBlankProduct(defaultListingType)
  const base = initial ?? {
    ...blank,
    subcategorySlug: defaultSubcategorySlug ?? '',
    itemCategory: defaultCategoryLabel ?? 'General',
  }

  const [draft, setDraft] = useState<Product>(structuredClone(base))

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return { draft, set }
}

export function ProductFormFields({
  draft,
  set,
}: {
  draft: Product
  set: <K extends keyof Product>(key: K, value: Product[K]) => void
}) {
  return (
    <>
      <Field label="Item name">
        <input
          value={draft.itemName}
          onChange={(e) => set('itemName', e.target.value)}
        />
      </Field>
      <div className="admin-modal__grid">
        <Field label="Item code">
          <input
            value={draft.itemCode}
            onChange={(e) => set('itemCode', e.target.value)}
          />
        </Field>
        <Field label="Price">
          <input
            type="number"
            value={draft.price}
            onChange={(e) => set('price', Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Type">
          <select
            value={draft.listingType}
            onChange={(e) => set('listingType', e.target.value as ListingType)}
          >
            <option value="rental">Rental</option>
            <option value="product">Purchase</option>
          </select>
        </Field>
        <Field label="Category label">
          <input
            value={draft.itemCategory}
            onChange={(e) => set('itemCategory', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Company">
        <input
          value={draft.company}
          onChange={(e) => set('company', e.target.value)}
        />
      </Field>
      <div className="admin-modal__grid">
        <Field label="Email">
          <input
            value={draft.contact}
            onChange={(e) => set('contact', e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            value={draft.vendorContact}
            onChange={(e) => set('vendorContact', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Location">
        <input
          value={draft.location}
          onChange={(e) => set('location', e.target.value)}
        />
      </Field>

      <div className="admin-modal__subheader">
        <h3>Card fields</h3>
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            set('cardFields', [...draft.cardFields, createEmptyRow()])
          }
        >
          + Field
        </button>
      </div>
      {draft.cardFields.map((row, idx) => (
        <div key={row.id} className="admin-modal__pair">
          <input
            value={row.label}
            placeholder="Field name"
            onChange={(e) => {
              const next = [...draft.cardFields]
              next[idx] = { ...row, label: e.target.value }
              set('cardFields', next)
            }}
          />
          <input
            value={row.value}
            placeholder="Value"
            onChange={(e) => {
              const next = [...draft.cardFields]
              next[idx] = { ...row, value: e.target.value }
              set('cardFields', next)
            }}
          />
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={() =>
              set(
                'cardFields',
                draft.cardFields.filter((r) => r.id !== row.id),
              )
            }
          >
            ×
          </button>
        </div>
      ))}
    </>
  )
}

export function ProductModal({
  initial,
  defaultListingType,
  defaultSubcategorySlug,
  defaultCategoryLabel,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: Product
  defaultListingType: ListingType
  defaultSubcategorySlug?: string
  defaultCategoryLabel?: string
  onSave: (product: Product) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const form = useProductFormState({
    initial,
    defaultListingType,
    defaultSubcategorySlug,
    defaultCategoryLabel,
  })

  return (
    <AdminModal
      size="md"
      title={initial ? 'Edit equipment' : 'Add equipment'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave(form.draft)}
    >
      <ProductFormFields {...form} />
    </AdminModal>
  )
}

export function SectionModal({
  initial,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: DetailSection
  onSave: (section: DetailSection) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<DetailSection>(
    structuredClone(initial ?? createEmptySection('New Section')),
  )

  return (
    <AdminModal
      size="lg"
      title={initial ? 'Edit section' : 'Add section'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave(draft)}
    >
      <div className="admin-modal__grid">
        <Field label="Section title">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </Field>
        <Field label="Section type">
          <select
            value={draft.type}
            onChange={(e) =>
              setDraft({
                ...draft,
                type: e.target.value as 'table' | 'text',
              })
            }
          >
            <option value="table">Table fields</option>
            <option value="text">Text block</option>
          </select>
        </Field>
      </div>

      {draft.type === 'text' ? (
        <Field label="Text">
          <textarea
            rows={5}
            value={draft.text ?? ''}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
        </Field>
      ) : (
        <>
          <div className="admin-modal__subheader">
            <h3>Rows</h3>
            <button
              type="button"
              className="admin-btn"
              onClick={() =>
                setDraft({
                  ...draft,
                  rows: [...draft.rows, createEmptyRow()],
                })
              }
            >
              + Row
            </button>
          </div>
          {draft.rows.map((row, idx) => (
            <div key={row.id} className="admin-modal__pair">
              <input
                value={row.label}
                placeholder="Any field name"
                onChange={(e) => {
                  const rows = [...draft.rows]
                  rows[idx] = { ...row, label: e.target.value }
                  setDraft({ ...draft, rows })
                }}
              />
              <input
                value={row.value}
                placeholder="Value"
                onChange={(e) => {
                  const rows = [...draft.rows]
                  rows[idx] = { ...row, value: e.target.value }
                  setDraft({ ...draft, rows })
                }}
              />
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() =>
                  setDraft({
                    ...draft,
                    rows: draft.rows.filter((r) => r.id !== row.id),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </AdminModal>
  )
}

export function FieldRowModal({
  initial,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: FieldRow
  onSave: (row: FieldRow) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const [label, setLabel] = useState(initial?.label ?? 'Field name')
  const [value, setValue] = useState(initial?.value ?? '')

  return (
    <AdminModal
      size="sm"
      title={initial ? 'Edit field' : 'Add field'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() =>
        onSave({
          id: initial?.id ?? createId('row'),
          label: label.trim() || 'Field',
          value,
        })
      }
    >
      <Field label="Field name">
        <input value={label} onChange={(e) => setLabel(e.target.value)} />
      </Field>
      <Field label="Value">
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
    </AdminModal>
  )
}

export function DetailEditorModal({
  sections,
  onSave,
  onClose,
}: {
  sections: DetailSection[]
  onSave: (sections: DetailSection[]) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<DetailSection[]>(
    structuredClone(sections),
  )

  function updateSection(id: string, patch: Partial<DetailSection>) {
    setDraft((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    )
  }

  function updateRow(
    sectionId: string,
    rowId: string,
    patch: Partial<FieldRow>,
  ) {
    setDraft((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              rows: s.rows.map((r) =>
                r.id === rowId ? { ...r, ...patch } : r,
              ),
            }
          : s,
      ),
    )
  }

  function addRow(sectionId: string) {
    setDraft((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, rows: [...s.rows, createEmptyRow()] } : s,
      ),
    )
  }

  function removeRow(sectionId: string, rowId: string) {
    setDraft((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, rows: s.rows.filter((r) => r.id !== rowId) }
          : s,
      ),
    )
  }

  function moveRow(sectionId: string, index: number, dir: -1 | 1) {
    setDraft((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const target = index + dir
        if (target < 0 || target >= s.rows.length) return s
        const rows = [...s.rows]
        const [moved] = rows.splice(index, 1)
        rows.splice(target, 0, moved)
        return { ...s, rows }
      }),
    )
  }

  function addSection() {
    setDraft((prev) => [...prev, createEmptySection('New Section')])
  }

  function removeSection(id: string) {
    setDraft((prev) => prev.filter((s) => s.id !== id))
  }

  function moveSection(index: number, dir: -1 | 1) {
    setDraft((prev) => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next
    })
  }

  return (
    <AdminModal
      size="lg"
      title="Edit details"
      onClose={onClose}
      onSave={() => onSave(draft)}
    >
      <div className="detail-editor">
        {draft.map((section, si) => (
          <div key={section.id} className="admin-section-block">
            <div className="admin-section-block__head">
              <input
                className="detail-editor__title"
                value={section.title}
                onChange={(e) =>
                  updateSection(section.id, { title: e.target.value })
                }
                placeholder="Section title"
              />
              <div className="admin-inline">
                <select
                  className="detail-editor__type"
                  value={section.type}
                  onChange={(e) =>
                    updateSection(section.id, {
                      type: e.target.value as 'table' | 'text',
                    })
                  }
                  aria-label="Section type"
                >
                  <option value="table">Table</option>
                  <option value="text">Text block</option>
                </select>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost detail-editor__icon-btn"
                  onClick={() => moveSection(si, -1)}
                  title="Move section up"
                  aria-label="Move section up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost detail-editor__icon-btn"
                  onClick={() => moveSection(si, 1)}
                  title="Move section down"
                  aria-label="Move section down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger detail-editor__icon-btn"
                  onClick={() => removeSection(section.id)}
                  title="Delete section"
                  aria-label="Delete section"
                >
                  ×
                </button>
              </div>
            </div>

            {section.type === 'text' ? (
              <textarea
                rows={4}
                value={section.text ?? ''}
                onChange={(e) =>
                  updateSection(section.id, { text: e.target.value })
                }
                placeholder="Text block content"
              />
            ) : (
              <>
                {section.rows.map((row, ri) => (
                  <div key={row.id} className="detail-editor__pair">
                    <input
                      value={row.label}
                      placeholder="Any field name"
                      onChange={(e) =>
                        updateRow(section.id, row.id, {
                          label: e.target.value,
                        })
                      }
                    />
                    <input
                      value={row.value}
                      placeholder="Value"
                      onChange={(e) =>
                        updateRow(section.id, row.id, {
                          value: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost detail-editor__icon-btn"
                      onClick={() => moveRow(section.id, ri, -1)}
                      title="Move field up"
                      aria-label="Move field up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost detail-editor__icon-btn"
                      onClick={() => moveRow(section.id, ri, 1)}
                      title="Move field down"
                      aria-label="Move field down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger detail-editor__icon-btn"
                      onClick={() => removeRow(section.id, row.id)}
                      title="Remove field"
                      aria-label="Remove field"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn detail-editor__add-row"
                  onClick={() => addRow(section.id)}
                >
                  + Field
                </button>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          className="admin-btn admin-btn--ghost detail-editor__add-section"
          onClick={addSection}
        >
          + Add section
        </button>
      </div>
    </AdminModal>
  )
}

export function ImagesModal({
  images,
  onSave,
  onClose,
}: {
  images: string[]
  onSave: (images: string[]) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<string[]>([...images])
  const [url, setUrl] = useState('')

  function onPickFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((prev) => [...prev, reader.result as string])
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <AdminModal
      size="md"
      title="Edit images"
      onClose={onClose}
      onSave={() => onSave(draft.length ? draft : ['/images/construction.jpg'])}
    >
      <div className="admin-images-grid">
        {draft.map((src, index) => (
          <div key={`${src.slice(0, 24)}-${index}`} className="admin-images-grid__item">
            <img src={src} alt="" />
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => setDraft(draft.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <Field label="Upload image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onPickFile(e.target.files?.[0])}
        />
      </Field>

      <Field label="Or add image URL / path">
        <div className="admin-modal__pair">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/images/excavator.jpg"
          />
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              if (!url.trim()) return
              setDraft((prev) => [...prev, url.trim()])
              setUrl('')
            }}
          >
            Add
          </button>
        </div>
      </Field>
    </AdminModal>
  )
}
