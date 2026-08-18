import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AdminFormPage } from '../../components/admin/AdminFormPage'
import { Field } from '../../components/admin/AdminControls'
import {
  ServiceFormFields,
  useServiceFormState,
} from '../../components/admin/CategoryEditors'
import { useData } from '../../data/DataContext'
import type { ListingType } from '../../types'

function listingTypeFromParams(params: URLSearchParams): ListingType {
  return params.get('type') === 'product' ? 'product' : 'rental'
}

export function AddServicePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const listingType = useMemo(() => listingTypeFromParams(params), [params])
  const { categoryGroups, getGroupsByType, updateCategoryGroup } = useData()
  const groups = useMemo(
    () => getGroupsByType(listingType),
    [getGroupsByType, listingType],
  )
  const form = useServiceFormState()
  const [groupId, setGroupId] = useState('')

  useEffect(() => {
    if (groups.length === 0) {
      setGroupId('')
      return
    }
    setGroupId((current) =>
      current && groups.some((group) => group.id === current)
        ? current
        : groups[0].id,
    )
  }, [groups])

  const selectedGroup = categoryGroups.find((group) => group.id === groupId)

  function goBack() {
    navigate(listingType === 'product' ? '/add?type=product' : '/add')
  }

  function handleSave() {
    if (!selectedGroup) return
    const service = form.buildService()
    updateCategoryGroup({
      ...selectedGroup,
      subcategories: [...selectedGroup.subcategories, service],
    })
    navigate(`/category/${service.slug}`)
  }

  return (
    <AdminFormPage
      title="Add service"
      subtitle="Create a service inside an existing category."
      listingType={listingType}
      onCancel={goBack}
      onSave={handleSave}
      saveLabel="Save service"
    >
      <Field label="Parent category">
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          disabled={groups.length === 0}
        >
          {groups.length === 0 ? (
            <option value="">No categories available</option>
          ) : (
            groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          )}
        </select>
      </Field>
      <ServiceFormFields {...form} />
    </AdminFormPage>
  )
}
