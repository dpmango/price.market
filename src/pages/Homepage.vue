<template>
  <main>
    <PostCategory />
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { PostCategory } from '@c/Post'

useHead({
  title: 'Pirce.market | Создание обьявления',
  meta: [],
})
</script>
