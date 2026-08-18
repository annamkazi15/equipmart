import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useIsAdmin } from '../auth/useIsAdmin'
import { HeaderUserMenu } from './HeaderUserMenu'
import { SearchBar } from './SearchBar'
import { TypeToggle } from './TypeToggle'
import type { ListingType } from '../types'

export function HomeToolbar({ onAddClick }: { onAddClick?: () => void }) {
  const { user, logout } = useAuth()
  const isAdmin = useIsAdmin()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const listingType: ListingType =
    params.get('type') === 'product' ? 'product' : 'rental'

  function setType(type: ListingType) {
    navigate(type === 'rental' ? '/' : '/?type=product')
  }

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="home-toolbar home-toolbar--inline">
      <div className="home-toolbar__controls">
        {isAdmin && onAddClick && (
          <button type="button" className="admin-text-btn" onClick={onAddClick}>
            Add
          </button>
        )}
        <SearchBar listingType={listingType} />
        <TypeToggle value={listingType} onChange={setType} />
      </div>
      {user && <HeaderUserMenu user={user} onLogout={onLogout} compact />}
    </div>
  )
}
