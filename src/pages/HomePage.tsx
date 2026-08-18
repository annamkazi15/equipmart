import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategorySection } from '../components/CategorySection'
import { useData } from '../data/DataContext'
import type { ListingType } from '../types'

export function HomePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const listingType: ListingType =
    params.get('type') === 'product' ? 'product' : 'rental'
  const { getGroupsByType } = useData()

  const groups = useMemo(
    () => getGroupsByType(listingType),
    [getGroupsByType, listingType],
  )

  function openAddHub() {
    navigate(listingType === 'product' ? '/add?type=product' : '/add')
  }

  return (
    <div className="page page--home">
      {groups.map((group, index) => (
        <CategorySection
          key={group.id}
          group={group}
          leadSection={index === 0}
          onOpenAddHub={index === 0 ? openAddHub : undefined}
        />
      ))}
    </div>
  )
}
