import { useAuth } from '../auth/AuthContext'

export function useIsAdmin() {
  const { user } = useAuth()
  return user?.role === 'admin'
}
