<template>
  <div class="page">
    <LayoutHeader />
    <!-- <LayoutMobileMenu /> -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { LayoutHeader } from '@c/Layout'
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
