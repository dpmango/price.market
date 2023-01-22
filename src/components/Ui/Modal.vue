<template>
  <div class="modal" :class="[show && '_visible', size && `_${size}`]">
    <div class="modal__bg" @click="closeModal"></div>
    <div class="modal__body">
      <div class="modal__container">
        <div class="pr-4 text-2xl font-bold" v-if="title">{{ title }}</div>
        <div class="modal__close" @click="closeModal">
          <SvgIcon name="close" />
        </div>
        <slot></slot>
        <div class="modal__actions" v-if="haveActions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v: string) => ['wide', 'normal'].includes(v),
  },
  title: {
    type: String,
  },
})

const slots = useSlots()
const haveActions = computed(() => {
  return slots.actions
})

const ui = useUiStore()
const show = ref(false)

const isModalActive = computed(() => {
  return ui.modal.includes(props.name)
})

watch(
  () => isModalActive.value,
  (newVal) => {
    if (newVal === true) {
      openModal()
    } else {
      closeModal()
    }
  }
)

const closeModal = () => {
  show.value = false
  ui.closeModal()
  unlockBody()
}

const openModal = () => {
  show.value = true
  lockBody()
}
</script>

<style lang="scss">
.modal {
  @apply pointer-events-none fixed left-0 top-0 z-[999] flex h-full w-full items-end justify-center md:items-center;

  &._visible {
    @apply pointer-events-auto;
    .modal {
      &__bg {
        @apply opacity-100;
      }
      &__container {
        @apply opacity-100;
        @apply transform-none;
      }
    }
  }

  &__bg {
    @apply fixed left-0 top-0 h-full w-full bg-gray-900 bg-opacity-50 opacity-0 transition;
  }

  &__body {
    @apply flex w-full max-w-sm items-center p-0 md:p-4;
  }

  &__container {
    @apply relative z-[5] mx-auto w-full rounded-lg bg-white py-3 px-4 opacity-0;
    @apply translate-y-10 transition will-change-transform;
  }

  &__close {
    @apply absolute right-2 top-2 cursor-pointer bg-white p-2 text-xl leading-[0] text-gray-500 transition;
    @apply hover:text-red-700;
  }

  &__actions {
    @apply mt-8 -mr-4 flex items-center;
    button {
      @apply mr-4 w-1/2 flex-shrink;
    }
  }

  &._wide {
    .modal {
      &__body {
        @apply max-w-xl;
      }
    }
  }
}
</style>
