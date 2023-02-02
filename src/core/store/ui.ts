import { writable, get, derived } from 'svelte/store'

export const mobileMenuActive = writable(false)
export const modal = writable([] as string[])
export const modalParams = writable(null as any)

export const setMobileMenu = (payload: { active: boolean }) => {
  const { active } = payload
  mobileMenuActive.set(active)
}

export const closeModal = () => {
  modal.set(get(modal).slice(0, -1))
  modalParams.set(null)
}

export const closeAllModals = () => {
  modal.set([])
  modalParams.set(null)
}

export const setModal = ({
  name,
  params,
  keepPrevious = false,
}: {
  name: string
  params?: any
  keepPrevious?: boolean
}) => {
  if (keepPrevious) {
    modal.set([...get(modal), ...[name]])
  } else {
    modal.set([name])
  }
  if (params) {
    modalParams.set(params)
  }
}
