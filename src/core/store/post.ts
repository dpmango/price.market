import type { ICategoryDto, ICategoryChilds } from '@/core/interface/Category'
import type { IOrder } from '@/core/interface/Order'
import { writable, derived, get } from 'svelte/store'
import { useApi } from '@/core/api'

const initialState = {
  categoryId: null,
  text: '',
  price: {
    currency: {
      label: 'Рублей',
      value: 'RUB',
    },
    value: 0,
  },
  location: {
    country: '',
    city: '',
    address: '',
  },
}

export const order = writable({ ...initialState } as IOrder)
export const categories = writable([] as ICategoryDto[])

export const categoriesList = derived(categories, ($categories) => {
  const mainCategories = $categories.filter((x) => !x.parent_id)

  return mainCategories.map((x) => {
    const childs = $categories.filter((y) => y.parent_id === x.id)

    return {
      ...x,
      childs,
    } as ICategoryChilds
  })
})

export const getCategories = async () => {
  const data = (await useApi('categories')) as ICategoryDto[]

  if (data) {
    categories.set(data)
  }

  return { data }
}

export const updateOrder = (payload: Partial<IOrder>) => {
  const newState = {
    ...get(order),
    ...payload,
  }

  console.log('store update order ::', { newState })
  order.set(newState)

  return newState
}

export const resetLocation = () => {
  order.set({
    ...get(order),
    location: {
      ...initialState.location,
    },
  })
}

export const resetPrice = () => {
  order.set({
    ...get(order),
    price: {
      ...initialState.price,
    },
  })
}

export const resetOrder = () => {
  order.set({
    ...initialState,
  })
}
