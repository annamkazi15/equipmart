import type { DetailSection, FieldRow, Product } from '../types'
import { InlineEditInput } from './InlineEditField'
import { ExpandableText } from './ExpandableText'

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type SectionEditMode = 'value-only' | 'both' | 'none'

function sectionEditMode(title: string): SectionEditMode {
  const normalized = title.trim().toLowerCase()
  if (normalized === 'specifications') return 'both'
  if (normalized === 'item details' || normalized === 'supplier & contact') {
    return 'value-only'
  }
  return 'none'
}

export function DetailSections({
  product,
  editable,
  showEditButton,
  onStartEdit,
  onSectionRowsChange,
  onDescriptionChange,
}: {
  product: Product
  editable: boolean
  showEditButton?: boolean
  onStartEdit?: () => void
  onSectionRowsChange: (sectionTitle: string, rows: FieldRow[]) => void
  onDescriptionChange: (text: string) => void
}) {
  function commitRowField(
    section: DetailSection,
    rowId: string,
    field: 'label' | 'value',
    nextValue: string,
  ) {
    const rows = section.rows.map((row) =>
      row.id === rowId ? { ...row, [field]: nextValue } : row,
    )
    onSectionRowsChange(section.title, rows)
  }

  return (
    <>
      {product.sections.map((section) => {
        const mode = editable ? sectionEditMode(section.title) : 'none'
        const isItemDetails =
          section.title.trim().toLowerCase() === 'item details'

        if (section.type === 'text') {
          const isDescription =
            section.title.trim().toLowerCase() === 'description'
          const text = section.text || product.description

          return (
            <div key={section.id} className="detail-section-wrap">
              <div className="specs-panel description-section">
                <div className="specs-panel__head">
                  <h2>{section.title}</h2>
                </div>
                {isDescription && editable ? (
                  <InlineEditInput
                    value={text}
                    editable
                    live
                    multiline
                    onChange={onDescriptionChange}
                  />
                ) : (
                  <p>{text}</p>
                )}
              </div>
            </div>
          )
        }

        return (
          <div key={section.id} className="detail-section-wrap">
            <div className="specs-panel">
              <div className="specs-panel__head">
                <h2>{section.title}</h2>
                {isItemDetails && showEditButton && onStartEdit && (
                  <button
                    type="button"
                    className="detail-edit-btn"
                    onClick={onStartEdit}
                    aria-label="Edit item details"
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                )}
              </div>
              {section.rows.length === 0 ? (
                <p className="detail-empty-rows">No fields yet.</p>
              ) : (
                <table className="specs-table">
                  <colgroup>
                    <col className="specs-table__label-col" />
                    <col className="specs-table__value-col" />
                  </colgroup>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          {mode === 'both' ? (
                            <InlineEditInput
                              value={row.label}
                              editable
                              live
                              onChange={(next) =>
                                commitRowField(section, row.id, 'label', next)
                              }
                            />
                          ) : (
                            <ExpandableText text={row.label} />
                          )}
                        </td>
                        <td>
                          {mode !== 'none' ? (
                            <InlineEditInput
                              value={row.value}
                              editable
                              live
                              onChange={(next) =>
                                commitRowField(section, row.id, 'value', next)
                              }
                            />
                          ) : (
                            <ExpandableText text={row.value} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
