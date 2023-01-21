<template>
  <PageWithTitle title="Создайте обьявление">
    <Suspense>
      <template #default>
        <PostCategories />
      </template>
      <template #fallback>
        <UiLoader />
      </template>
    </Suspense>
  </PageWithTitle>
</template>

<script setup lang="ts">
import { PageWithTitle } from '@c/Layout'
import { PostCategories } from '@c/Post'

useHead({
  title: 'Pirce.market | Создание обьявления',
  meta: [],
})
</script>
