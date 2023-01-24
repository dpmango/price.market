<template>
  <div class="mb-1 flex items-center" v-bind="$attrs">
    <div class="gray-800 block text-base font-bold">{{ title }}</div>
    <span
      @click="emit('onMinusClick')"
      class="ml-auto flex-shrink-0 cursor-pointer text-xl leading-[0] text-gray-200 transition hover:text-gray-500"
    >
      <SvgIcon name="minus-circle" />
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

const emit = defineEmits(['onMinusClick'])
</script>
