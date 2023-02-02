<script lang="ts">
  import cns from 'classnames'
  import { createEventDispatcher } from 'svelte'
  import Select from 'svelte-select/no-styles/Select.svelte'
  import { nanoid } from 'nanoid'

  import type { ISelect } from '@/core/interface/Ui'
  import { SvgIcon } from '@c/Ui'

  const id = nanoid()

  const emit = createEventDispatcher()

  export let value: ISelect | null = null
  export let options: ISelect[] = []
  export let label: string | null = null
  export let placeholder = 'Выберите'
  export let theme: string | null = null
  export let error: string | null = null

  let opened = false
  $: getLabel = typeof error === 'string' ? error : label

  const setSelected = (e: CustomEvent<ISelect>) => {
    emit('onSelect', e.detail)
  }

  let valueOld = value
  $: if (valueOld !== value) {
    if (value) {
      emit('onSelect', value)
      valueOld = value
    }
  }
</script>

<div
  class={cns('select', { 'has-error': error }, theme, opened && 'is-opened', value && 'has-value')}
>
  {#if label}
    <label class="select__label" for={id}>{getLabel}</label>
  {/if}

  <Select
    {id}
    items={options}
    {value}
    hasError={!!error}
    {placeholder}
    searchable={false}
    clearable={false}
    showChevron={true}
    on:change={setSelected}
    on:open={() => (opened = true)}
    on:close={() => (opened = false)}
    {...$$restProps}
  >
    <div slot="chevron-icon">
      <SvgIcon name="chevron-down" />
    </div>
    <span slot="empty"> Не найдено </span>
  </Select>
</div>

<style lang="scss">
  .select {
    @apply relative;
    &.has-error {
      .select__label {
        @apply text-red-500;
      }
    }
  }

  :global(.svelte-select) {
    @apply relative m-0 box-border flex h-[42px] w-full min-w-[105px] items-center rounded-r-lg border border-gray-200 bg-gray-50 pl-3 pr-2 transition;
    @apply hover:border-blue-500 hover:bg-white;
  }

  :global(.svelte-select input) {
    @apply absolute left-0 m-0 h-[42px] w-full cursor-default border-none bg-transparent p-2 py-0 pl-3 text-base leading-10 text-gray-500;
    @apply hover:border-gray-400 focus:outline-none;
  }

  :global(.select.focused) {
    @apply border-blue-500;
  }

  :global(.select.disabled) {
    @apply border-gray-200 bg-gray-200 text-gray-600;
  }

  :global(.select.disabled input) {
    @apply placeholder:text-gray-300 placeholder:opacity-100;
  }

  :global(.svelte-select .selected-item) {
    @apply h-[42px] overflow-x-hidden leading-10;
    @apply focus:outline-none;
  }

  :global(.svelte-select .icons) {
    @apply pointer-events-none absolute right-0 top-0 bottom-0 flex translate-y-0 items-center text-gray-500;
  }

  :global(.svelte-select .icons > *) {
    @apply transition-colors duration-200 ease-in-out;
  }

  :global(.svelte-select .clear-select) {
    @apply pointer-events-auto;
  }

  .select.focused .icons,
  .svelte-select .chevron:hover {
    @apply text-gray-500;
  }

  :global(.svelte-select .clear-select) {
    @apply h-5 w-9 flex-none px-2 text-gray-500;
    @apply hover:text-red-500;
  }

  :global(.svelte-select .chevron) {
    @apply flex h-5 w-5 pt-0 pr-2 pl-2 text-gray-500;
  }

  // .select.multi {
  //   @apply h-auto flex-wrap items-stretch pr-9 pl-4;
  // }

  // .select.multi input {
  //   @apply relative m-0 p-0;
  // }

  :global(.select.error) {
    @apply border-red-500 bg-white;
  }

  :global(.a11y-text) {
    @apply sr-only;
  }

  // LIST styles
  :global(.svelte-select-list) {
    @apply absolute left-0 right-0 z-10 max-h-64 w-full overflow-y-auto rounded-t-md border border-none border-gray-200 bg-white p-0 shadow-none;
  }

  :global(.list-group-title) {
    @apply h-[42px] cursor-default overflow-ellipsis whitespace-nowrap px-5 text-sm font-medium uppercase leading-10 text-gray-300;
  }

  :global(.svelte-select-list .empty) {
    @apply py-5 text-center text-gray-500;
  }

  :global(.item) {
    @apply cursor-default overflow-hidden overflow-ellipsis whitespace-nowrap py-2 px-4 text-base text-gray-800 transition;
  }

  :global(.item.group-item) {
    @apply px-10;
  }

  :global(.item:active) {
    @apply bg-yellow-100 text-gray-900;
  }

  :global(.item.active) {
    @apply bg-yellow-100 text-gray-900;
  }

  :global(.item.not-selectable) {
    @apply text-gray-300;
  }

  // .item.first {
  //   @apply rounded-t-sm;
  // }

  :global(.item.hover:not(.active)) {
    @apply bg-yellow-100 text-gray-900;
  }

  // .multi input {
  //   flex: 1 1 40px;
  // }

  // .multi-item {
  //   @apply mt-1 mr-1 ml-1 flex h-8 max-w-full cursor-default items-center overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm border border-gray-200 bg-gray-100 pr-1 pl-1 leading-8;
  // }

  // .multi-item.disabled {
  //   @apply hover:bg-gray-300 hover:text-gray-500;
  // }

  // .multi-item-clear {
  //   @apply flex w-5 items-center justify-center;
  // }

  :global(.list-item) {
    @apply list-none;
  }
</style>
