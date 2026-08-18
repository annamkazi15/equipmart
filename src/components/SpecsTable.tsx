import type { FieldRow } from '../types'
import { ExpandableText } from './ExpandableText'

export function SpecsTable({
  rows,
  title,
}: {
  rows: FieldRow[]
  title?: string
}) {
  if (!rows.length) return null

  return (
    <div className="specs-panel">
      {title && <h2>{title}</h2>}
      <table className="specs-table">
        <colgroup>
          <col className="specs-table__label-col" />
          <col className="specs-table__value-col" />
        </colgroup>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <ExpandableText text={row.label} />
              </td>
              <td>
                <ExpandableText text={row.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
