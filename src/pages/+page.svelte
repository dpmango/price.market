<script lang="ts">
  import { PageWithTitle } from '@c/Layout'
  import { PostCategories } from '@c/Post'
  // import type { PageData } from './$types'

  // used store values instead
  // export let data: PageData

  // console.log(data)
</script>

<svelte:head>
  <title>Pirce.market | Создание обьявления</title>
  <meta name="description" content="Pirce.market | Создание обьявления" />
</svelte:head>

<PageWithTitle title="Создайте обьявление">
  <PostCategories />
</PageWithTitle>
