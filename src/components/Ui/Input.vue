<template>
  <div class="input relative z-[1]" :class="modifiers">
    <label class="gray-800 mb-1 block text-base font-bold" v-if="label" :for="id">
      <template v-if="typeof label === 'string'">{{ label }}</template>
      <span v-if="optional" class="font-normal"> (не обязательно) </span>
    </label>

    <!-- center -->
    <div class="relative flex flex-col">
      <component
        :class="['input__input']"
        :is="getElement"
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :value="value"
        :type="type"
        :disabled="disabled"
        ref="inputRef"
        :style="textareaStyle"
        v-bind="$attrs"
        @input="setValue"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <div
        class="absolute right-3 top-[50%] z-[3] flex translate-y-2/4 items-center text-[0px]"
        ref="iconsRef"
      >
        <template v-if="loading || valid">
          <i class="input__icon animate-spin text-gray-500" v-if="loading">
            <SvgIcon name="loading" />
          </i>
          <i class="input__icon text-green-700" v-else-if="valid && !disabled">
            <SvgIcon name="checkmark" />
          </i>
        </template>

        <i
          class="input__icon text-red-700"
          :class="[isClearable && '_clearable']"
          v-if="showError && !showErrorText"
          @click="() => isClearable && clearInput()"
        >
          <SvgIcon name="close" />
        </i>

        <SvgIcon :name="icon" v-if="icon" />
      </div>
    </div>

    <!-- bottom section -->
    <div
      class="mt-1 text-sm text-gray-500"
      v-if="maxCount"
      :class="[value.length > maxCount && 'text-red-700']"
    >
      {{ value.length }}/{{ maxCount }}
    </div>
    <div class="mt-1 text-sm text-red-700" v-if="showErrorText">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'

const id = nanoid()
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['onChange', 'onFocus', 'onBlur'])

const props = defineProps<{
  value: string
  label?: string | boolean
  type?: string
  placeholder?: string
  name?: string
  optional?: boolean
  theme?: 'primary' | 'secondary'
  icon?: string
  iconPosition?: 'left' | 'right'
  // modifiers
  error?: string | boolean
  valid?: boolean
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  // functional
  focusOnMount?: boolean
  focusHook?: boolean
  maxCount?: number
  // https://github.com/beholdr/maska
  mask?: string | any
  // textarea
  maxRows?: number
}>()

const theme = computed(() => {
  return props.theme || 'primary'
})
const iconPosition = computed(() => {
  return props.iconPosition || 'right'
})

const modifiers = computed(() => [
  isFocusedOrNotBlank.value && '_focused',
  focusedState.value === id && 'z-[5]',
  showError.value && '_error',
  props.valid && !props.disabled && '_valid',
  props.disabled && '_disabled',
  props.icon && `_ipos-${iconPosition.value}`,
  `_${theme.value}`,
])

// general logic
const isTextarea = computed(() => {
  return props.type === 'textarea'
})

const getElement = computed(() => {
  if (isTextarea.value) {
    return 'textarea'
  }

  return 'input'
})

const showError = computed(() => {
  return props.error && !isFocused.value
})

const setValue = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value

  emit('onChange', value, e)

  if (isTextarea.value) {
    nextTick(() => {
      resizeTextarea()
    })
  }
}

// focus handle
const isFocused = ref(false)
const [focusedState, setFocusedState] = useState(false)

const isFocusedOrNotBlank = computed(() => {
  try {
    if (props.value && props.value.toString().trim().length > 0) {
      return true
    }
  } catch {
    return false
  }

  return isFocused.value
})

const handleFocus = () => {
  isFocused.value = true
  setFocusedState(id)
  emit('onFocus')
}
const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  })
  emit('onBlur')
}

watch(
  () => isFocused.value,
  (newVal) => {
    if (!isMobile()) return
    if (newVal) {
      document.body.classList.add('input-active')
    } else {
      document.body.classList.remove('input-active')
    }
  }
)

const handleAutocompleate = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target && target.getAttribute('id') === id) {
    if (target.hasAttribute('autocompleted')) {
      isFocused.value = true
    }
  }
}

watch(
  () => props.focusHook,
  (newVal) => {
    if (newVal) {
      inputRef.value?.focus()
    }
  }
)

// inputs width watcher
const iconsRef = ref<HTMLElement | null>(null)
const placeholderRef = ref<HTMLElement | null>(null)

const setInputOffsets = () => {
  try {
    if (!iconsRef.value) return

    const iconsWidth = iconsRef.value?.offsetWidth + 5 + 16
    if (inputRef.value) inputRef.value.style.paddingRight = `${iconsWidth}px`
    if (placeholderRef.value) placeholderRef.value.style.right = `${iconsWidth}px`
  } catch {
    // unknown
  }
}

watch(
  () => [props.value, props.error, props.valid],
  () => {
    nextTick(setInputOffsets)
  }
)

// error
const showErrorText = computed(() => {
  if (isFocused.value) return false
  return typeof props.error === 'string'
})

// clear
const isClearable = computed(() => {
  if (props.clearable) {
    return props.value && props.value.replace(/^\s+|\s+$/g, '').length > 1
  } else {
    return false
  }
})

const clearInput = () => {
  emit('onChange', '')
}

// textarea autosize
const height = ref('')
const resizeTextarea = () => {
  height.value = 'auto !important'
  nextTick(() => {
    if (!inputRef.value || !props.maxRows) return
    const style = window.getComputedStyle(inputRef.value)
    const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = lineHeight * props.maxRows + padding + 2

    let newHeight = inputRef.value.scrollHeight + 2
    if (newHeight >= maxHeight) newHeight = maxHeight

    height.value = `${newHeight}px`
  })
}

const textareaStyle = computed(() => {
  if (isTextarea.value) {
    return { height: height.value }
  } else {
    return {}
  }
})

// hooks
onMounted(() => {
  if (props.focusOnMount && !isAndroid()) {
    inputRef.value?.focus()
  }
  if (isTextarea.value) {
    nextTick(() => resizeTextarea)
  }

  document.addEventListener('onautocomplete', handleAutocompleate, false)
})

onBeforeUnmount(() => {
  setInputOffsets()
  document.removeEventListener('onautocomplete', handleAutocompleate, false)
})
</script>

<style lang="scss" scoped>
.input {
  &__input {
    @apply relative z-[2] block w-[100%] resize-none rounded-lg border border-gray-200 py-2 px-3 text-base transition;
    @apply placeholder:text-gray-500;
    @apply hover:border-gray-800;
    @apply focus:border-gray-800;
    @apply disabled:pointer-events-none disabled:opacity-75;
  }

  &__icon {
    @apply mr-2 text-gray-500 transition last:mr-0;
    &._error {
      @apply text-red-700;
      &._clearable {
        @apply cursor-pointer;
        @apply hover:text-gray-800;
      }
    }

    &._clear,
    &._close {
      @apply cursor-pointer text-gray-500;
      @apply hover:text-red-700;
    }
  }

  &._valid {
    .input {
      &__input {
        @apply border-green-700;
      }
    }
  }

  &._error {
    .input {
      &__input {
        @apply border-red-700;
      }
    }
  }
}

@keyframes rotateLoader {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>
