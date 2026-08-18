export type UserRole = 'admin' | 'user'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  initials: string
}

export const DEMO_USERS = [
  {
    id: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    initials: 'AU',
  },
  {
    id: 'user',
    password: 'user123',
    name: 'Rahul Sharma',
    role: 'user' as const,
    initials: 'RS',
  },
] as const

const STORAGE_KEY = 'equipmart_auth'

export function authenticate(userId: string, password: string): AuthUser | null {
  const match = DEMO_USERS.find(
    (u) => u.id === userId.trim().toLowerCase() && u.password === password,
  )
  if (!match) return null
  return {
    id: match.id,
    name: match.name,
    role: match.role,
    initials: match.initials,
  }
}

export function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function storeUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}
