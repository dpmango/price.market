<script lang="ts">
  import { page } from '$app/stores'

  import { PageWithTitle } from '@c/Layout'
  import { updateOrder } from '@/core/store/post'

  if ($page.params.id) {
    updateOrder({
      categoryId: +$page.params.id,
    })
  }
</script>

<svelte:head>
  <title>Pirce.market | Детали обьявления</title>
  <meta name="description" content="Pirce.market | Детали обьявления" />
</svelte:head>

<PageWithTitle title="Добавьте детали">.. page in dev ..</PageWithTitle>
