<script lang="ts">
  import { page } from '$app/stores'

  import { PageWithTitle } from '@c/Layout'
  import { UiButton } from '@c/Ui'

  console.warn({ error_page: $page })
</script>

<svelte:head>
  <title>Pirce.market | 404</title>
  <meta name="description" content="Pirce.market | 404" />
</svelte:head>

<PageWithTitle>
  <div class="flex flex-col items-center">
    <h1 class="text-center text-4xl font-bold">{$page.status}</h1>
    <p class="my-4 text-center text-lg">
      {#if $page.status === 404}
        Страница не найдена. <br />Проверьте правильность адреса
      {/if}
    </p>
    <UiButton to="/">На главную</UiButton>
  </div>
</PageWithTitle>
