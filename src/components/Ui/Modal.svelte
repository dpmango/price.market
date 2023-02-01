<script lang="ts">
  import cns from 'classnames'
  import { browser } from '$app/environment'

  import { modal, closeModal as dispatchClose } from '@/core/store/ui'
  import { unlockBody, lockBody } from '@/core/utils'
  import { SvgIcon } from '@c/Ui'

  export let name: string
  export let size: 'wide' | 'normal' | undefined = 'normal'
  export let title: string

  const haveActions = !$$slots.actions

  let show = false

  $: isModalActive = $modal.includes(name)
  let isModalActiveOld = $modal.includes(name)

  $: if (isModalActiveOld !== isModalActive) {
    if (isModalActive === true) {
      openModal()
    } else {
      closeModal()
    }

    isModalActiveOld = isModalActive
  }

  const closeModal = () => {
    show = false
    dispatchClose()
    browser && unlockBody()
  }

  const openModal = () => {
    show = true
    browser && lockBody()
  }
</script>

<div class={cns('modal', show && '_visible', size && `_${size}`)}>
  <div class="modal__bg" on:click={closeModal} />
  <div class="modal__body">
    <div class="modal__container">
      {#if title}
        <div class="pr-4 text-2xl font-bold">{title}</div>
      {/if}
      <div class="modal__close" on:click={closeModal}>
        <SvgIcon name="close" />
      </div>
      <slot />
      {#if haveActions}
        <div class="modal__actions">
          <slot name="actions" />
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .modal {
    @apply pointer-events-none fixed left-0 top-0 z-[999] flex h-full w-full items-end justify-center md:items-center;

    &._visible {
      @apply pointer-events-auto;
      .modal {
        &__bg {
          @apply opacity-100;
        }
        &__container {
          @apply opacity-100;
          @apply transform-none;
        }
      }
    }

    &__bg {
      @apply fixed left-0 top-0 h-full w-full bg-gray-900 bg-opacity-50 opacity-0 transition;
    }

    &__body {
      @apply flex w-full items-center p-0 md:max-w-sm md:p-4;
    }

    &__container {
      @apply relative z-[5] mx-auto w-full rounded-lg bg-white py-3 px-4 opacity-0;
      @apply translate-y-10 transition will-change-transform;
    }

    &__close {
      @apply absolute right-2 top-2 cursor-pointer bg-white p-2 text-xl leading-[0] text-gray-500 transition;
      @apply hover:text-red-700;
    }

    &__actions {
      @apply mt-8 -mr-4 flex items-center;
      :global(button) {
        @apply mr-4 w-1/2 flex-shrink;
      }
    }

    &._wide {
      .modal {
        &__body {
          @apply max-w-xl;
        }
      }
    }
  }
</style>
