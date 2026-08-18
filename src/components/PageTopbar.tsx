import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { BackButton } from './BackButton'
import { HeaderUserMenu } from './HeaderUserMenu'
import { SearchBar } from './SearchBar'
import type { ListingType } from '../types'

export function PageTopbar({ listingType }: { listingType: ListingType }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="detail-topbar">
      <BackButton />

      <div className="detail-topbar__controls">
        <SearchBar listingType={listingType} />
        {user && <HeaderUserMenu user={user} onLogout={onLogout} compact />}
      </div>
    </div>
  )
}
