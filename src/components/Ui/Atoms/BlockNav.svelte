<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { SvgIcon } from '@c/Ui'

  export let title: string | null = null

  const emit = createEventDispatcher()
</script>

<div class="mb-1 flex items-center" {...$$restProps}>
  <div class="gray-800 block text-base font-bold">{title}</div>
  <span
    on:click={() => emit('onMinusClick')}
    class="ml-auto flex-shrink-0 cursor-pointer text-xl leading-[0] text-gray-200 transition hover:text-gray-500"
  >
    <SvgIcon name="minus-circle" />
  </span>
</div>
