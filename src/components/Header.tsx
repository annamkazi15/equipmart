import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { SearchBar } from './SearchBar'
import { TypeToggle } from './TypeToggle'
import { HeaderUserMenu } from './HeaderUserMenu'
import type { ListingType } from '../types'

const HIDE_HEADER = /^\/(product|category|add)(\/|$)/
const HOME_PATH = '/'

export function Header() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
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

  if (!user) return null

  if (HIDE_HEADER.test(pathname) || pathname === HOME_PATH) return null

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">EQ</span>
          <span className="brand__text">
            <span className="brand__name">EquipMart</span>
            <span className="brand__tag">Buy & Rent Equipment</span>
          </span>
        </Link>

        <div className="header-center">
          <SearchBar listingType={listingType} />
          <TypeToggle value={listingType} onChange={setType} />
        </div>

        <HeaderUserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}
