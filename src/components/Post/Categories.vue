<template>
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
</template>

<script setup lang="ts">
import { PostCategory } from '@c/Post'

const postStore = usePostStore()
const { categoriesList } = storeToRefs(postStore)

const activeCategoryId = ref<number | null>(null)
const handleToggle = (id: number) => {
  activeCategoryId.value = activeCategoryId.value === id ? null : id
}

await postStore.getCategories()
</script>
