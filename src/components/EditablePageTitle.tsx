export function EditablePageTitle({
  title,
  editLabel,
  editable,
  onEdit,
  className,
}: {
  title: string
  editLabel: string
  editable: boolean
  onEdit: () => void
  className?: string
}) {
  if (!editable) {
    return <h1 className={className}>{title}</h1>
  }

  return (
    <button
      type="button"
      className={['page-title-edit', className].filter(Boolean).join(' ')}
      onClick={onEdit}
      aria-label={editLabel}
      title={editLabel}
    >
      {title}
    </button>
  )
}
