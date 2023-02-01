<script>
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import LayoutHeader from '@c/Layout/Header.svelte'

  import '$lib/styles/app.scss'
</script>

<div class="page">
  <LayoutHeader />
  <slot />
  <SvelteToast />
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
