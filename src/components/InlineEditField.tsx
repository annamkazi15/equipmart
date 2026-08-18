import { useEffect, useState } from 'react'
import { ExpandableText } from './ExpandableText'

export function InlineEditInput({
  value,
  editable,
  onCommit,
  onChange,
  live = false,
  multiline = false,
}: {
  value: string
  editable: boolean
  onCommit?: (value: string) => void
  onChange?: (value: string) => void
  live?: boolean
  multiline?: boolean
}) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  function handleChange(next: string) {
    setDraft(next)
    if (live) onChange?.(next)
  }

  function handleBlur() {
    if (!live && draft !== value) onCommit?.(draft)
  }

  if (!editable) {
    return multiline ? (
      <span className="inline-edit__static">{value?.trim() ? value : '—'}</span>
    ) : (
      <ExpandableText text={value} />
    )
  }

  if (multiline) {
    return (
      <textarea
        className="inline-edit inline-edit--area"
        value={draft}
        rows={4}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
    )
  }

  return (
    <input
      className="inline-edit"
      type="text"
      value={draft}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
    />
  )
}
