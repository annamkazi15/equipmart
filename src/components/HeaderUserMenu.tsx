import type { AuthUser } from '../auth/credentials'

export function HeaderUserMenu({
  user,
  onLogout,
  compact = false,
}: {
  user: AuthUser
  onLogout: () => void
  compact?: boolean
}) {
  return (
    <div className={['user-menu', compact ? 'user-menu--compact' : undefined].filter(Boolean).join(' ')}>
      {!compact && (
        <div className="user-menu__meta">
          <span className="user-menu__name">{user.name}</span>
          <span className="user-menu__role">
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
      )}
      <button
        type="button"
        className="user-menu__avatar"
        aria-label="Logout"
        title="Logout"
        onClick={onLogout}
      >
        {user.initials}
      </button>
    </div>
  )
}