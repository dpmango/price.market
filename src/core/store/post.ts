import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePostStore = defineStore('post', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot))
}
