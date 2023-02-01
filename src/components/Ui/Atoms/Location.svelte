<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { UiButton } from '@c/Ui'

  export let location: {
    country?: string
    city?: string
    address?: string
  } = {}

  const emit = createEventDispatcher()
</script>

<div class="rounded-lg bg-gray-50 py-3 px-4">
  {#if location.country}
    <span class="text-sm">{location.country}</span>
  {/if}
  {#if location.city}
    <span class="text-sm">, г. {location.city}</span>
  {/if}
  {#if location.address}
    <span class="text-sm text-gray-500"> <br />{location.address} </span>
  {/if}

  <div class="mt-2">
    <UiButton size="small" theme="secondary" on:click={() => emit('onChangeRequest')}>
      Изменить
    </UiButton>
  </div>
</div>
