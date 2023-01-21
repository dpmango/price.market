<template>
  <component
    :is="getElement"
    :class="['button', theme, size, isEmpty && '_iconOnly', showLoader && '_loading']"
    :href="href"
    :to="to"
    v-bind="$attrs"
  >
    <span class="button__content">
      <i class="button__icon._left" v-if="iconLeft">
        <SvgIcon :name="iconLeft" :fill="iconFill" />
      </i>
      <slot></slot>
      <i class="button__icon._right" v-if="iconRight">
        <SvgIcon :name="iconRight" :fill="iconFill" />
      </i>
    </span>

    <span class="button__loader" v-if="showLoader">
      <!-- SvgIcon -->
    </span>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps({
  theme: {
    type: String,
    default: 'primary',
    validator: (v: string) => ['', 'primary', 'link'].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['large', 'medium', 'small'].some((x) => v.split(' ').includes(x)),
  },
  href: String,
  iconRight: String,
  iconLeft: String,
  iconFill: {
    type: Boolean,
    default: false,
  },
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
  -webkit-appearance: none;
  position: relative;
  padding: 0;
  display: inline-block;
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: 8px;
  text-align: center;
  overflow: hidden;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.25s ease, color 0.25s ease, border 0.25s ease, outline 0.25s ease,
    box-shadow 0.25s ease;

  &__content {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  &__icon {
    flex: 0 0 auto;
    font-size: 1.3334em;
    &._left {
      margin-right: 0.45em;
    }
    &._right {
      margin-left: 0.45em;
    }
  }
  &._iconOnly {
    .button__icon {
      margin-left: 0;
      margin-right: 0;
    }
  }

  &__loader {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s ease;
    .nuxt-icon {
      animation: rotateLoader 1s linear infinite;
    }
  }

  // themes
  &.primary {
    background: $colorPrimary;
    color: $colorBg;
    // &:focus {
    // }
    // &:hover {
    // }
    // &:active {
    // }

    &[disabled] {
      background: $colorBorderLight;
      color: $colorDisabled;
      pointer-events: none;
    }
  }

  // sizes
  &.large {
    .button__content {
      padding: 15px 31px;
      font-size: 18px;
      line-height: calc(24 / 18);
      letter-spacing: 0.02em;
    }
    &._iconOnly {
      .button__content {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  }

  &.medium {
    .button__content {
      padding: 11px 23px;
      font-size: 16px;
      line-height: calc(24 / 16);
      letter-spacing: 0.02em;
    }
  }

  &.small {
    border-radius: 6px;
    .button__content {
      padding: 7px 15px;
      font-size: 14px;
      line-height: calc(20 / 14);
      letter-spacing: 0.02em;
    }
    &._iconOnly {
      .button__content {
        padding: 9px;
      }
    }
  }

  &[block] {
    display: block;
    width: 100%;
  }

  &._loading {
    .button {
      &__content {
        opacity: 0;
      }
      &__loader {
        opacity: 1;
      }
    }
  }
}
</style>
