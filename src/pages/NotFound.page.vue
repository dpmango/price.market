<template>
  <PageWithTitle>
    <div class="flex flex-col items-center">
      <h1 class="text-center text-4xl font-bold">404</h1>
      <p class="my-4 text-center text-lg">
        Страница не найдена. <br />Проверьте правильность адреса
      </p>
      <UiButton to="/">На главную</UiButton>
    </div>
  </PageWithTitle>
</template>

<script setup lang="ts">
import { PageWithTitle } from '@c/Layout'
import { PostDescription } from '@c/Post'

useHead({
  title: 'Pirce.market | 404',
  meta: [],
})
</script>
