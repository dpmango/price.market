<template>
  <component
    :is="getElement"
    :class="['button', `_${theme}`, `_${size}`, isEmpty && '_iconOnly', showLoader && '_loading']"
    :href="href"
    :to="to"
    v-bind="$attrs"
  >
    <span class="button__content">
      <i class="button__icon _left" v-if="iconLeft">
        <SvgIcon :name="iconLeft" />
      </i>
      <slot></slot>
      <i class="button__icon _right" v-if="iconRight">
        <SvgIcon :name="iconRight" />
      </i>
    </span>

    <span class="button__loader" v-if="showLoader">
      <SvgIcon name="loader" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps({
  theme: {
    type: String,
    default: 'primary',
    validator: (v: string) => ['', 'primary', 'secondary', 'link'].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['large', 'medium', 'small'].some((x) => v.split(' ').includes(x)),
  },
  href: String,
  iconRight: String,
  iconLeft: String,

  to: String,
  loading: {
    type: Boolean,
    default: false,
  },
})

const getElement = computed(() => {
  if (props.href) {
    return 'a'
  } else if (props.to) {
    return RouterLink
  }

  return 'button'
})

const slots = useSlots()
const isEmpty = computed(() => {
  return !slots.default
})

const showLoader = ref(false)
let timer = null as any

watch(
  () => props.loading,
  (newVal) => {
    if (newVal === true) {
      timer = setTimeout(() => {
        showLoader.value = true
      }, 200)
    } else if (newVal === false) {
      showLoader.value = false
      clearTimeout(timer)
    }
  }
)
</script>

<style lang="scss" scoped>
.button {
  @apply relative cursor-pointer appearance-none overflow-hidden rounded-lg border border-transparent p-0 text-center shadow-none transition;
  &__content {
    @apply relative z-[1] inline-flex items-center justify-center;
  }

  &__icon {
    @apply flex-shrink-0 text-xl leading-[0];
    &._left {
      @apply mr-1;
    }
    &._right {
      @apply ml-1;
    }
  }
  &._iconOnly {
    .button__icon {
      @apply mx-0;
    }
  }

  &__loader {
    @apply pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-[3] inline-flex items-center justify-center opacity-0 transition;
    svg {
      animation: rotateLoader 1s linear infinite;
    }
  }

  // themes
  &._primary {
    @apply bg-yellow-600 text-gray-800;
    @apply hover:bg-yellow-700;
    @apply focus:bg-yellow-700 focus:shadow-[0px_0px_0px_2px_rgba(255,255,255,1),0px_0px_0px_3px_rgb(212,209,224,1)];
    @apply active:bg-yellow-700 active:shadow-[0px_0px_0px_2px_rgb(245,127,23,1)];
    @apply disabled:pointer-events-none disabled:bg-gray-100;
  }

  &._secondary {
    @apply border-gray-200 bg-gray-50 text-gray-800;
    @apply hover:border-gray-300 hover:bg-gray-100;
    @apply focus:border-gray-300 focus:bg-gray-100;
    @apply active:bg-gray-300;
    @apply disabled:pointer-events-none disabled:bg-gray-100;
  }

  // sizes
  &._large {
    .button__content {
      @apply px-5 py-4 text-xl font-bold;
    }
  }

  &._medium {
    .button__content {
      @apply px-4 py-3 text-lg font-bold;
    }
  }

  &._small {
    .button__content {
      @apply px-3 py-2 text-sm;
    }
  }

  &._link {
    @apply hover:text-blue-800;
    .button__content {
      @apply py-1;
    }
  }

  &[block] {
    @apply block w-full;
  }

  &._loading {
    .button {
      &__content {
        @apply opacity-0;
      }
      &__loader {
        @apply opacity-100;
      }
    }
  }
}
</style>
