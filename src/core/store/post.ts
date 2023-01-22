import type { Ref } from 'vue'
import type { ICategoryDto, ICategoryChilds } from '@/core/interface/Category'
import type { IOrder } from '@/core/interface/Order'

const initialState = {
  categoryId: null,
  text: '',
  price: {
    currency: 'RUR',
    value: 0,
  },
  location: {
    country: '',
    city: '',
    address: '',
  },
}

export const usePostStore = defineStore('post', () => {
  const order = ref({ ...initialState }) as Ref<IOrder>

  const categories = ref([]) as Ref<ICategoryDto[]>

  const categoriesList = computed(() => {
    const mainCategories = categories.value.filter((x) => !x.parent_id)

    return mainCategories.map((x) => {
      const childs = categories.value.filter((y) => y.parent_id === x.id)

      return {
        ...x,
        childs,
      } as ICategoryChilds
    })
  })

  async function getCategories() {
    const data = (await useApi('categories')) as ICategoryDto[]

    if (data) {
      categories.value = data
    }

    return data
  }

  const updateOrder = (payload: Partial<IOrder>) => {
    const newState = {
      ...order.value,
      ...payload,
    }

    console.log('store update order ::', { newState })
    order.value = newState

    return newState
  }

  const resetLocation = () => {
    console.log('ask to reset')
    order.value.location = {
      ...initialState.location,
    }
  }

  const resetOrder = () => {
    order.value = {
      ...initialState,
    }
  }

  return {
    categories,
    categoriesList,
    getCategories,
    order,
    updateOrder,
    resetLocation,
    resetOrder,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot))
}
