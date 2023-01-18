<template>
  <div class="container">
    <h1 class="py-4 text-2xl font-bold md:text-4xl">Заполните описание</h1>

    <div class="">
      {{ order }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/core/store'

const postStore = usePostStore()
const { order } = storeToRefs(postStore)
</script>
