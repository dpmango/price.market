<template>
  <PageWithTitle>
    <div class="my-4">
      <UiButton @click="router.push('/')">На главную</UiButton>
    </div>
  </PageWithTitle>
</template>

<script setup lang="ts">
import { PageWithTitle } from '@c/Layout'

const router = useRouter()

useHead({
  title: 'Pirce.market | Интерфейс (dev страница)',
  meta: [],
})
</script>
