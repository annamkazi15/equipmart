import { useNavigate } from 'react-router-dom'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="back-btn"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      title="Go back"
    >
      ‹
    </button>
  )
}