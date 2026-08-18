import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AdminFormPage } from '../../components/admin/AdminFormPage'
import {
  CategoryGroupFormFields,
  useCategoryGroupFormState,
} from '../../components/admin/CategoryEditors'
import { useData } from '../../data/DataContext'
import type { ListingType } from '../../types'

function listingTypeFromParams(params: URLSearchParams): ListingType {
  return params.get('type') === 'product' ? 'product' : 'rental'
}

export function AddCategoryPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const listingType = useMemo(() => listingTypeFromParams(params), [params])
  const { addCategoryGroup } = useData()
  const form = useCategoryGroupFormState(undefined, listingType)

  function goHome() {
    navigate(listingType === 'product' ? '/?type=product' : '/')
  }

  function handleSave() {
    addCategoryGroup(form.buildGroup())
    goHome()
  }

  return (
    <AdminFormPage
      title="Add category"
      subtitle="Create a new category section on the homepage."
      listingType={listingType}
      onCancel={goHome}
      onSave={handleSave}
      saveLabel="Save category"
    >
      <CategoryGroupFormFields {...form} />
    </AdminFormPage>
  )
}
