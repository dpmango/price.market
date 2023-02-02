<script lang="ts">
  import cns from 'classnames'
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import { goto } from '$app/navigation'

  import type { ICategoryChilds } from '@/core/interface/Category'
  import { updateOrder } from '@/core/store/post'
  import { SvgIcon } from '@c/Ui'
  import { PostCategory } from '@c/Post'

  const emit = createEventDispatcher()

  export let category: ICategoryChilds
  export let activeCategoryId: number | null = null

  $: isNavCategory = category.childs?.length
  $: isActiveCategory = activeCategoryId === category.id

  const handleCategoryClick = () => {
    const id = category.id

    if (isNavCategory) {
      emit('onToggle', id)
    } else {
      updateOrder({ categoryId: id })
      goto(`/create/${id}`)
    }
  }
</script>

<div class={cns('category', !isNavCategory && 'ml-4')} data-id={category.id}>
  <div class="group mt-3 flex cursor-pointer items-center" on:click={handleCategoryClick}>
    <div
      class={cns(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full  transition group-hover:bg-yellow-400',
        isActiveCategory ? 'bg-yellow-400' : 'bg-gray-50'
      )}
    >
      <span class="text-2xl">{category.emoji}</span>
    </div>
    <div class="px-2.5 text-base">{category.name}</div>
    {#if isNavCategory}
      <span class="ml-auto text-xl leading-none">
        <SvgIcon name="chevron-down" />
      </span>
    {/if}
  </div>

  {#if isActiveCategory}
    <div transition:slide>
      {#each category.childs as childCategory}
        <PostCategory category={childCategory} />
      {/each}
    </div>
  {/if}
</div>
