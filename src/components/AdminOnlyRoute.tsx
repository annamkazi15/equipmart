import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useIsAdmin } from '../auth/useIsAdmin'

export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
