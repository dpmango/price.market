<template>
  <div class="input" :class="modifiers">
    <label class="input__label text-m" v-if="label" :for="id">
      <template v-if="typeof label === 'string'">{{ label }}</template>
    </label>

    <div class="input__wrapper">
      <component
        class="input__input"
        :is="getElement"
        :id="id"
        :name="name"
        :value="value"
        :type="type"
        :disabled="disabled"
        ref="inputRef"
        v-maska="mask"
        :style="textareaStyle"
        v-bind="$attrs"
        @input="setValue"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <label class="input__placeholder" v-if="placeholder" ref="placeholderRef" :for="id">
        {{ placeholder }}
      </label>

      <div class="input__icons" ref="iconsRef">
        <template v-if="loading || valid">
          <i class="input__icon _loading" v-if="loading">
            <SvgIcon name="loading" />
          </i>
          <i class="input__icon _valid" v-else-if="valid && !disabled">
            <SvgIcon name="check" />
          </i>
        </template>

        <i
          class="input__icon _error"
          :class="[isClearable && '_clearable']"
          v-if="showError && !showErrorText"
          @click="() => isClearable && clearInput()"
        >
          <SvgIcon name="close" />
        </i>

        <SvgIcon :name="icon" v-if="icon" />
      </div>
    </div>
    <div class="input__count" v-if="maxCount" :class="[value.length > maxCount && '_err']">
      {{ value.length }}/{{ maxCount }}
    </div>
    <div class="input__error" v-if="showErrorText">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { vMaska } from 'maska'

const id = nanoid()
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['onChange', 'onFocus', 'onBlur'])

const props = defineProps<{
  value: string
  label?: string | boolean
  type?: string
  placeholder?: string
  name?: string
  theme?: 'primary' | 'secondary'
  size?: 'medium' | 'small'
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
const size = computed(() => {
  return props.size || 'normal'
})
const iconPosition = computed(() => {
  return props.iconPosition || 'right'
})

const modifiers = computed(() => [
  isFocusedOrNotBlank.value && '_focused',
  focusedState.value === id && '_focused_current',
  showError.value && '_error',
  props.valid && !props.disabled && '_valid',
  props.disabled && '_disabled',
  props.icon && `_ipos-${iconPosition.value}`,
  `_${theme.value}`,
  `_${size.value}`,
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
  position: relative;
  z-index: 1;
  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  &__label {
    display: inline-block;
    min-height: 22px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  &__placeholder {
    position: absolute;
    z-index: 3;
    font-weight: 400;
    color: $colorDisabled;
    pointer-events: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: all 0.25s ease;
  }

  &__input {
    position: relative;
    z-index: 2;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    border: 1px solid $colorBorder;
    background: white;
    border-radius: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5;
    color: $colorFont;
    resize: none;
    overflow: hidden;
    box-shadow: none;
    transition-property: border, color, background, box-shadow;
    transition-duration: 0.25s;
    transition-timing-function: ease;
    &::placeholder {
      color: $colorDisabled;
    }
    &:focus,
    &:active {
      border-color: $colorFont;
      box-shadow: 0 0 0 4px rgba(0, 97, 174, 0.3);
    }
    &:hover {
      border-color: $colorFont;
    }
    &[readonly],
    &[disabled] {
      color: #c0cdda;
      background-color: $colorBg;
      border-color: $colorBorderLight;
      &:hover,
      &:focus,
      &:active {
        color: #c0cdda;
        background-color: $colorBg;
        border-color: $colorBorderLight;
        outline: none;
      }
      + .input__placeholder {
        color: #c0cdda;
        // opacity: 0;
      }
    }
  }

  // compontents
  &__icons {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    top: 50%;
    font-size: 0;
    transform: translateY(-50%);
    > * {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__icon {
    color: $colorDisabled;
    transition: color 0.25s ease, opacity 0.25s ease;
    &._error {
      color: $colorRed;
      &._clearable {
        cursor: pointer;
        &:hover {
          color: $colorFont;
        }
      }
    }
    &._loading {
      color: $colorGray;
      animation: rotateLoader 1s linear infinite;
    }
    &._clear,
    &._close {
      color: $colorGray;
      cursor: pointer;
      &:hover {
        color: $colorRed;
      }
    }

    &._valid {
      color: $colorGreen;
    }
  }

  &__error {
    // position: absolute;
    // top: 100%;
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.5;
    color: $colorRed;
  }
  &__count {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.25;
    letter-spacing: -0.005em;
    color: $colorDisabled;
    &._err {
      color: $colorRed;
    }
  }

  // SIZE modifiers
  &._normal {
    .input {
      &__placeholder {
        top: 23px;
        left: 20px;
        right: 20px;
        font-size: 18px;
        line-height: 1.5;
      }
      &__input {
        font-size: 18px;
        padding: 32px 20px 11px;
      }
      &__icons {
        right: 20px;
      }
      &__icon,
      &__eye {
        font-size: 24px;
      }
    }
    &._focused {
      .input {
        &__placeholder {
          top: 12px;
          font-size: 12px;
        }
      }
    }

    &._ipos-right {
      .input {
        &__icons {
          right: 20px;
        }
        &__input {
          padding-right: 56px;
        }
        &__placeholder {
          right: 56px;
        }
      }
    }
    &._valid {
      .input {
        &__input {
          border-color: $colorGreen;
        }
      }
    }
  }

  &._focused {
    .input {
      &__input {
        border-color: #7ca1bf;
      }
    }
  }
  &._focused_current {
    z-index: 4;
  }

  &._error {
    .input {
      &__input {
        border-color: $colorRed;
      }
      &__placeholder {
        color: $colorRed;
      }
    }
  }
  &._disabled {
    .input {
      &__label {
        color: $colorDisabled;
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
