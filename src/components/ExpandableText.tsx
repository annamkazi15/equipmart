export function ExpandableText({ text }: { text: string }) {
  const value = text?.trim() ? text : '—'

  return (
    <span className="expandable-text expandable-text--row">
      <span className="expandable-text__full">{value}</span>
    </span>
  )
}