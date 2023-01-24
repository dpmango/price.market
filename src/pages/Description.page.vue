<template>
  <PageWithTitle title="Заполните описание">
    <Suspense>
      <template #default>
        <PostDescription />
      </template>
      <template #fallback>
        <UiLoader />
      </template>
    </Suspense>
  </PageWithTitle>
</template>

<script setup lang="ts">
import { PageWithTitle } from '@c/Layout'
import { PostDescription } from '@c/Post'

const postStore = usePostStore()
const route = useRoute()

useHead({
  title: 'Pirce.market | Создание обьявления',
  meta: [],
})

if (route.params.id) {
  postStore.updateOrder({
    categoryId: +route.params.id,
  })
}
</script>
