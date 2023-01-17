<template>
  <div class="category">
    <div class="container">
      <h1 class="m-0 py-4 text-4xl font-bold leading-10">Создайте обьявление</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/core'
import { onMounted } from 'vue'

onMounted(async () => {
  const data = await useApi('categories')
  console.log({ data })
})
</script>
