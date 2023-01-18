import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useApi } from '@/core'
import type { ICategoryDto, ICategoryChilds } from '@/core/interface/Category'
import type { IOrder } from '@/core/interface/Order'

export const usePostStore = defineStore('post', () => {
  const order = ref({
    categoryId: null,
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

  return { categories, categoriesList, getCategories, order, updateOrder }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot))
}
