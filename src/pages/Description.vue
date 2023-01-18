<template>
  <main>
    <Suspense>
      <template #default>
        <PostDescription />
      </template>
      <template #fallback>
        <UiLoader />
      </template>
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { PostDescription } from '@c/Post'
import { UiLoader } from '@c/Ui'

useHead({
  title: 'Pirce.market | Создание обьявления',
  meta: [],
})
</script>
