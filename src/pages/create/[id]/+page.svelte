<script lang="ts">
  import { page } from '$app/stores'

  import { PageWithTitle } from '@c/Layout'
  import { PostDescription } from '@c/Post'
  import { updateOrder } from '@/core/store/post'

  if ($page.params.id) {
    updateOrder({
      categoryId: +$page.params.id,
    })
  }
</script>

<svelte:head>
  <title>Pirce.market | Создание обьявления</title>
  <meta name="description" content="Pirce.market | Создание обьявления" />
</svelte:head>

<PageWithTitle title="Заполните описание">
  <PostDescription />
</PageWithTitle>
