import type { Ref } from 'vue'
import type { ICategoryDto, ICategoryChilds } from '@/core/interface/Category'
import type { IOrder } from '@/core/interface/Order'

export const usePostStore = defineStore('post', () => {
  const order = ref({
    categoryId: null,
    location: {
      country: null,
      city: null,
      address: null,
    },
  }) as Ref<IOrder>

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
    order.value = {
      ...order.value,
      ...payload,
    }
  }

  const resetOrder = () => {
    order.value = {
      categoryId: null,
      location: {
        country: null,
        city: null,
        address: null,
      },
    }
  }

  return { categories, categoriesList, getCategories, order, updateOrder, resetOrder }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot))
}
