<script lang="ts">
  import { PostCategory } from '@c/Post'
  import { categoriesList } from '@/core/store/post'

  let activeCategoryId = null as number | null

  const handleToggle = (id: number) => {
    activeCategoryId = activeCategoryId === id ? null : id
  }
</script>

<div class="md:mx-auto md:max-w-md md:px-1">
  <h4 class="text-lg font-bold">Выберите категорию</h4>

  {#each $categoriesList as category}
    <PostCategory {category} {activeCategoryId} on:onToggle={(e) => handleToggle(e.detail)} />
  {/each}
</div>
