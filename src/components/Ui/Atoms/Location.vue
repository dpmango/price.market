<template>
  <div class="rounded-lg bg-gray-50 py-3 px-4">
    <span class="text-sm" v-if="location.country">{{ location.country }}</span>
    <span class="text-sm" v-if="location.city">, г. {{ location.city }}</span>
    <span class="text-sm text-gray-500" v-if="location.address">
      <br />{{ location.address }}
    </span>

    <div class="mt-2">
      <UiButton size="small" theme="secondary" @click.stop="emit('onChangeRequest')">
        Изменить
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  location: {
    country?: string
    city?: string
    address?: string
  }
}>()

const emit = defineEmits(['onChangeRequest'])
</script>
