import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import {
  COMPANY_TABLE_COLUMNS,
  countActiveFilters,
  filterProductsByColumns,
  getTableCellValue,
  getUniqueColumnValues,
  isColumnFilterActive,
  isColumnSorted,
  sortProductsByColumn,
  type ColumnFilterState,
  type ColumnSortState,
  type SortDirection,
  type TableColumnDef,
} from '../data/companyTable'
import { ColumnFilterMenu } from './ColumnFilterMenu'

function TableCell({
  productId,
  column,
  value,
}: {
  productId: string
  column: TableColumnDef
  value: string
}) {
  if (column.source === 'company') {
    return (
      <td>
        <Link to={`/product/${productId}`} className="company-table__company">
          {value}
        </Link>
      </td>
    )
  }

  if (column.source === 'email' && value !== '—') {
    return (
      <td>
        <a href={`mailto:${value}`}>{value}</a>
      </td>
    )
  }

  if (column.source === 'phone' && value !== '—') {
    return (
      <td>
        <a href={`tel:${value.replace(/\s/g, '')}`}>{value}</a>
      </td>
    )
  }

  if (column.source === 'price') {
    return <td className="company-table__price">{value}</td>
  }

  return <td>{value}</td>
}

function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path
        d="M1.5 2.5h13l-5 6v4.5l-3-1.5V8.5l-5-6z"
        opacity={active ? 1 : 0.72}
      />
    </svg>
  )
}

export function CompanyTableView({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<ColumnFilterState>({})
  const [sort, setSort] = useState<ColumnSortState | null>(null)
  const [openColumnKey, setOpenColumnKey] = useState<string | null>(null)
  const filterBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const columnValues = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const col of COMPANY_TABLE_COLUMNS) {
      map[col.key] = getUniqueColumnValues(products, col)
    }
    return map
  }, [products])

  const displayedProducts = useMemo(() => {
    const filtered = filterProductsByColumns(products, filters)
    return sortProductsByColumn(filtered, sort)
  }, [products, filters, sort])

  const activeFilterCount = countActiveFilters(filters, products)
  const openColumn = COMPANY_TABLE_COLUMNS.find((col) => col.key === openColumnKey)

  function applyColumnFilter(columnKey: string, selection: Set<string> | null) {
    setFilters((prev) => {
      const next = { ...prev }
      if (!selection) {
        delete next[columnKey]
      } else {
        next[columnKey] = selection
      }
      return next
    })
  }

  function clearColumnFilter(columnKey: string) {
    setFilters((prev) => {
      const next = { ...prev }
      delete next[columnKey]
      return next
    })
    setOpenColumnKey(null)
  }

  function applyColumnSort(columnKey: string, direction: SortDirection) {
    setSort({ columnKey, direction })
  }

  function clearColumnSort() {
    setSort(null)
    setOpenColumnKey(null)
  }

  function clearAllFilters() {
    setFilters({})
    setSort(null)
    setOpenColumnKey(null)
  }

  return (
    <div className="company-table-wrap">
      {(activeFilterCount > 0 || sort) && (
        <div className="company-table__filter-bar">
          <span>
            {activeFilterCount > 0 && (
              <>
                {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} active
              </>
            )}
            {activeFilterCount > 0 && sort && ' · '}
            {sort && (
              <>
                Sorted by{' '}
                {COMPANY_TABLE_COLUMNS.find((c) => c.key === sort.columnKey)?.label}{' '}
                ({sort.direction === 'asc' ? 'ascending' : 'descending'})
              </>
            )}
            {' · '}
            Showing {displayedProducts.length} of {products.length}
          </span>
          <button type="button" onClick={clearAllFilters}>
            Clear all
          </button>
        </div>
      )}

      <table className="company-table">
        <thead>
          <tr>
            {COMPANY_TABLE_COLUMNS.map((col) => {
              const values = columnValues[col.key] ?? []
              const canFilter = col.filterable !== false
              const isFiltered =
                canFilter && isColumnFilterActive(filters, col.key, values)
              const isSorted = isColumnSorted(sort, col.key)
              const isActive = isFiltered || isSorted
              const isOpen = openColumnKey === col.key

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`company-table__th${isActive ? ' company-table__th--filtered' : ''}`}
                >
                  <div className="company-table__th-inner">
                    <span>
                      {col.label}
                      {isSorted && (
                        <span className="company-table__sort-indicator" aria-hidden>
                          {sort?.direction === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </span>
                    {canFilter && (
                      <button
                        ref={(el) => {
                          filterBtnRefs.current[col.key] = el
                        }}
                        type="button"
                        className={`company-table__filter-btn${isActive ? ' active' : ''}`}
                        aria-label={`Filter and sort ${col.label}`}
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenColumnKey((current) =>
                            current === col.key ? null : col.key,
                          )
                        }
                      >
                        <FilterIcon active={isActive} />
                      </button>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {displayedProducts.length === 0 ? (
            <tr>
              <td className="company-table__empty" colSpan={COMPANY_TABLE_COLUMNS.length}>
                No companies match the current filters.
              </td>
            </tr>
          ) : (
            displayedProducts.map((product) => (
              <tr key={product.id}>
                {COMPANY_TABLE_COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    productId={product.id}
                    column={col}
                    value={getTableCellValue(product, col)}
                  />
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {openColumn && (
        <ColumnFilterMenu
          columnLabel={openColumn.label}
          values={columnValues[openColumn.key] ?? []}
          sortKind={openColumn.sortKind ?? 'text'}
          appliedSelection={filters[openColumn.key] ?? null}
          appliedSort={
            sort?.columnKey === openColumn.key ? sort.direction : null
          }
          anchorEl={filterBtnRefs.current[openColumn.key]}
          onApply={(selection) => applyColumnFilter(openColumn.key, selection)}
          onSort={(direction) => applyColumnSort(openColumn.key, direction)}
          onClearFilter={() => clearColumnFilter(openColumn.key)}
          onClearSort={clearColumnSort}
          onClose={() => setOpenColumnKey(null)}
        />
      )}
    </div>
  )
}
