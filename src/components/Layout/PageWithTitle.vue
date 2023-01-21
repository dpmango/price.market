<template>
  <div class="container">
    <h1 class="pt-3 pb-4 text-2xl font-bold md:pb-5 md:pt-4 md:text-4xl">{{ title }}</h1>
  </div>

  <div class="wrapper md:rounded-t-xl md:bg-gray-50 md:py-5">
    <div class="container">
      <div class="md:rounded-xl md:bg-white md:px-5 md:py-7">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style lang="scss" scoped>
@include rmin($md) {
  .wrapper {
    min-height: calc(100vh - 55px - 76px);
    display: flex;
    flex-direction: column;
    .container {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      > div {
        flex: 1 0 auto;
      }
    }
  }
}
</style>
