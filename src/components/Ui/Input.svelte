<script lang="ts">
  import cns from 'classnames'
  import { createEventDispatcher, onMount, onDestroy, tick } from 'svelte'
  import { nanoid } from 'nanoid'
  import { browser } from '$app/environment'

  import { SvgIcon } from '@c/Ui'
  import { isMobile, isAndroid } from '@/core/utils'

  const id = nanoid()

  let inputRef: HTMLInputElement | HTMLTextAreaElement

  const emit = createEventDispatcher()

  export let value: string
  export let label: string | boolean | null = null
  export let type: string | null = null
  export let placeholder: string | null = null
  export let name: string | null = null
  export let optional: boolean | null = null
  export let theme: 'primary' | 'secondary' | null = 'primary'
  export let icon: string | null = null
  export let iconPosition: 'left' | 'right' | null = 'right'
  export let inputClass: string | null = null
  // modifiers
  export let error: string | boolean | null = null
  export let valid: boolean | null = null
  export let disabled: boolean | null = null
  export let clearable: boolean | null = null
  export let loading: boolean | null = null
  // functional
  export let focusOnMount: boolean | null = null
  export let focusHook: boolean | null = null
  export let maxCount: number | null = null
  // textarea
  export let maxRows: number | null = null

  $: modifiers = [
    isFocusedOrNotBlank() && '_focused',
    // focusedState === id && 'z-[5]',
    showError && '_error',
    valid && !disabled && '_valid',
    disabled && '_disabled',
    icon && `_ipos-${iconPosition}`,
    `_${theme}`,
  ]

  // general logic
  $: isTextarea = type === 'textarea'
  $: showError = error && !isFocused

  const setValue = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value

    emit('onChange', value, e)

    if (isTextarea) {
      await tick()
      resizeTextarea()
    }
  }

  // focus handle
  let isFocused = false
  let isFocusedOld = false
  // const [focusedState, setFocusedState] = useState(false)

  const isFocusedOrNotBlank = () => {
    try {
      if (value && value.toString().trim().length > 0) {
        return true
      }
    } catch {
      return false
    }

    return isFocused
  }

  const handleFocus = () => {
    isFocused = true
    // setFocusedState(id)
    emit('onFocus')
  }
  const handleBlur = () => {
    setTimeout(() => {
      isFocused = false
    })
    emit('onBlur')
  }

  const handleAutocompleate = (e: Event) => {
    const target = e.target as HTMLInputElement

    if (target && target.getAttribute('id') === id) {
      if (target.hasAttribute('autocompleted')) {
        isFocused = true
      }
    }
  }

  $: if (focusHook) inputRef?.focus()

  // inputs width watcher
  let iconsRef = null as HTMLElement | null

  // error
  $: showErrorText = isFocused ? false : typeof error === 'string'

  // clear
  $: isClearable = clearable
    ? value && value.toString().replace(/^\s+|\s+$/g, '').length > 1
    : false

  const clearInput = () => {
    emit('onChange', '')
  }

  // textarea autosize
  let height = ''
  const resizeTextarea = async () => {
    height = 'auto !important'

    await tick()
    if (!inputRef || !maxRows) return
    const style = window.getComputedStyle(inputRef)
    const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = lineHeight * maxRows + padding + 2

    let newHeight = inputRef.scrollHeight + 2
    if (newHeight >= maxHeight) newHeight = maxHeight

    height = `${newHeight}px`
  }

  $: textareaStyle = isTextarea ? `height: ${height}` : ''

  // hooks
  onMount(async () => {
    if (focusOnMount && !isAndroid()) {
      inputRef?.focus()
    }
    if (isTextarea) {
      await tick()
      resizeTextarea()
    }

    document.addEventListener('onautocomplete', handleAutocompleate, false)
  })

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('onautocomplete', handleAutocompleate, false)
    }
  })
</script>

<div class={cns('input relative z-[1]', modifiers)}>
  {#if label}
    <label class="gray-800 mb-1 block text-base font-bold" for={id}>
      {#if typeof label === 'string'}
        {label}
      {/if}
      {#if optional}
        <span class="font-normal"> (не обязательно) </span>
      {/if}
    </label>
  {/if}

  <!-- center -->
  <div class="relative flex flex-col">
    <svelte:element
      this={isTextarea ? 'textarea' : 'input'}
      class={cns('input__input', inputClass)}
      {id}
      {name}
      {placeholder}
      {value}
      {type}
      {disabled}
      bind:this={inputRef}
      style={textareaStyle}
      {...$$restProps}
      on:input={setValue}
      on:focus={handleFocus}
      on:blur={handleBlur}
    />

    <div
      class="absolute right-3 top-[50%] z-[3] flex translate-y-2/4 items-center text-[0px]"
      bind:this={iconsRef}
    >
      {#if loading}
        <i class="input__icon animate-spin text-gray-500">
          <SvgIcon name="loading" />
        </i>
      {/if}
      {#if valid && !disabled}
        <i class="input__icon text-green-700">
          <SvgIcon name="checkmark" />
        </i>
      {/if}

      {#if showError && !showErrorText}
        <i
          class={cns('input__icon text-red-700', isClearable && '_clearable')}
          on:click={() => isClearable && clearInput()}
        >
          <SvgIcon name="close" />
        </i>
      {/if}

      {#if icon}
        <SvgIcon name={icon} />
      {/if}
    </div>
  </div>

  <!-- bottom section -->
  {#if maxCount}
    <div class={cns('mt-1 text-sm text-gray-500', value.length > maxCount && 'text-red-700')}>
      {value.length}/{maxCount}
    </div>
  {/if}
  {#if showErrorText}
    <div class="mt-1 text-sm text-red-700">{error}</div>
  {/if}
</div>

<style lang="scss">
  .input {
    &__input {
      @apply relative z-[2] block w-[100%] resize-none rounded-lg border border-gray-200 py-2 px-3 text-base transition;
      @apply placeholder:text-gray-500;
      @apply hover:border-gray-800;
      @apply focus:border-gray-800;
      @apply disabled:pointer-events-none disabled:opacity-75;
      &.combobox {
        padding-right: 110px !important;
      }
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
