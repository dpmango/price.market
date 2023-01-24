<template>
  <PageWithTitle title="Добавьте детали">
    <Suspense>
      <template #default> .. page in dev .. </template>
      <template #fallback>
        <UiLoader />
      </template>
    </Suspense>
  </PageWithTitle>
</template>

<script setup lang="ts">
import { PageWithTitle } from '@c/Layout'

const postStore = usePostStore()
const route = useRoute()

useHead({
  title: 'Pirce.market | Детали обьявления',
  meta: [],
})

if (route.params.id) {
  postStore.updateOrder({
    categoryId: +route.params.id,
  })
}
</script>
