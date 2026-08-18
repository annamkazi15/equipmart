import { useState } from 'react'
import type { CategoryGroup, ListingType, SubCategory } from '../../types'
import { createId } from '../../data/normalize'
import { AdminModal, Field, toSlug } from './AdminControls'

export function useCategoryGroupFormState(
  initial: CategoryGroup | undefined,
  listingType: ListingType,
) {
  const [name, setName] = useState(initial?.name ?? 'New Category Group')
  const [type, setType] = useState<ListingType>(
    initial?.listingType ?? listingType,
  )

  function buildGroup(): CategoryGroup {
    const nextName = name.trim() || 'Untitled group'
    return {
      id: initial?.id ?? createId('cat'),
      name: nextName,
      slug: initial?.slug ?? toSlug(nextName),
      image: initial?.image ?? '/images/construction.jpg',
      listingType: type,
      subcategories: initial?.subcategories ?? [],
    }
  }

  return { name, setName, type, setType, buildGroup }
}

export function CategoryGroupFormFields({
  name,
  setName,
  type,
  setType,
}: {
  name: string
  setName: (value: string) => void
  type: ListingType
  setType: (value: ListingType) => void
}) {
  return (
    <>
      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Type" className="admin-modal__field--half">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ListingType)}
        >
          <option value="rental">Rental</option>
          <option value="product">Purchase</option>
        </select>
      </Field>
    </>
  )
}

export function CategoryGroupModal({
  initial,
  listingType,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: CategoryGroup
  listingType: ListingType
  onSave: (group: CategoryGroup) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const form = useCategoryGroupFormState(initial, listingType)

  return (
    <AdminModal
      size="sm"
      title={initial ? 'Edit category group' : 'Add category group'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave(form.buildGroup())}
    >
      <CategoryGroupFormFields {...form} />
    </AdminModal>
  )
}

export function useServiceFormState(initial?: SubCategory) {
  const [name, setName] = useState(initial?.name ?? 'New Service')
  const [image, setImage] = useState(
    initial?.image ?? '/images/construction.jpg',
  )

  function onPickFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function buildService(): SubCategory {
    const nextName = name.trim() || 'Untitled service'
    return {
      id: initial?.id ?? createId('sub'),
      name: nextName,
      slug: initial?.slug ?? toSlug(nextName),
      count: initial?.count ?? 0,
      image: image.trim() || '/images/construction.jpg',
    }
  }

  return { name, setName, image, setImage, onPickFile, buildService }
}

export function ServiceFormFields({
  name,
  setName,
  image,
  onPickFile,
}: {
  name: string
  setName: (value: string) => void
  image: string
  onPickFile: (file: File | undefined) => void
}) {
  return (
    <>
      <Field label="Service name">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Image">
        <div className="admin-image-picker">
          {image && (
            <img src={image} alt="" className="admin-image-picker__preview" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
        </div>
      </Field>
    </>
  )
}

export function ServiceModal({
  initial,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: SubCategory
  onSave: (service: SubCategory) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const form = useServiceFormState(initial)

  return (
    <AdminModal
      size="sm"
      title={initial ? 'Edit service' : 'Add service'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave(form.buildService())}
    >
      <ServiceFormFields {...form} />
    </AdminModal>
  )
}
