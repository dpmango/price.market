<template>
  <div class="page">
    <LayoutHeader />
    <!-- <LayoutMobileMenu /> -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// const api = useApi
import { LayoutHeader } from '@c/Layout'
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .footer {
    margin-top: auto;
  }
}
</style>
