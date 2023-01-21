<template>
  <PageWithTitle title="Создайте обьявление">
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

useHead({
  title: 'Pirce.market | Создание обьявления',
  meta: [],
})
</script>
