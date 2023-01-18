<template>
  <div class="container">
    <h1 class="pt-3 pb-4 text-2xl font-bold md:pb-5 md:pt-4 md:text-4xl">Создайте обьявление</h1>
  </div>

  <div class="wrapper md:rounded-t-xl md:bg-gray-50 md:py-5">
    <div class="container">
      <div class="md:rounded-xl md:bg-white md:px-5 md:py-7">
        <div class="md:mx-auto md:max-w-md md:px-1">
          <h4 class="text-lg font-bold">Выберите категорию</h4>

          <PostCategory
            v-for="category in categoriesList"
            :key="category.id"
            :category="category"
            :activeCategoryId="activeCategoryId"
            @on-toggle="handleToggle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/core/store'
import { PostCategory } from '@c/Post'

const postStore = usePostStore()
const { categoriesList } = storeToRefs(postStore)

const activeCategoryId = ref<number | null>(null)
const handleToggle = (id: number) => {
  activeCategoryId.value = activeCategoryId.value === id ? null : id
}

await postStore.getCategories()
</script>

<style lang="scss" scoped>
@include rmin($md) {
  .wrapper {
    min-height: calc(100vh - 55px - 76px);
    display: flex;
    flex-direction: column;
    .container {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      > div {
        flex: 1 0 auto;
      }
    }
  }
}
</style>
