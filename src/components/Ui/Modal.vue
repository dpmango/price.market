<template>
  <div class="modal" :class="[show && 'visible', size && `_${size}`]">
    <div class="modal__bg" @click="closeModal"></div>
    <div class="modal__body">
      <div class="modal__container">
        <div class="modal__title" v-if="title">{{ title }}</div>
        <div class="modal__close" @click="closeModal">
          <nuxt-icon name="close"></nuxt-icon>
        </div>
        <slot></slot>
        <div class="modal__actions" v-if="haveActions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v: string) => ['wide', 'normal'].includes(v),
  },
  title: {
    type: String,
  },
})

const slots = useSlots()
const haveActions = computed(() => {
  return slots.actions
})

const ui = useUiStore()
const show = ref(false)

const isModalActive = computed(() => {
  return ui.modal.includes(props.name)
})

watch(
  () => isModalActive.value,
  (newVal) => {
    if (newVal === true) {
      openModal()
    } else {
      closeModal()
    }
  }
)

const closeModal = () => {
  show.value = false
  ui.closeModal()
  unlockBody()
}

const openModal = () => {
  show.value = true
  lockBody()
}
</script>

<style lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // height: stretch;
  pointer-events: none;
  padding: 20px;

  &.visible {
    pointer-events: all;
    .modal {
      &__bg {
        opacity: 1;
      }
      &__container {
        opacity: 1;
        transform: none;
      }
    }
  }

  &__bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba($colorFont, 0.3);
    transition: opacity ease 0.5s;
    opacity: 0;
  }

  &__body {
    min-height: calc(100% - (1.75px * 2));
    margin: 1.75px auto;
    padding: 0 0px;
    display: flex;
    align-items: center;
    max-width: 645px;
    width: 100%;
  }

  &__container {
    width: 100%;
    position: relative;
    z-index: 5;
    opacity: 0;
    margin: 0 auto 0;
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    transform: translate3d(0, 40px, 0);
    will-change: transform;
    transition: opacity 0.2s ease, transform 0.35s ease;
  }

  &__title {
    padding-right: 40px;
  }
  &__close {
    font-size: 30px;
    color: $colorDisabled;
    position: absolute;
    right: 25px;
    top: 25px;
    padding: 5px;
    cursor: pointer;
    background: #fff;
    transition: color 0.25s ease;
    &:hover {
      color: $colorRed;
    }
  }

  &__actions {
    margin-top: 32px;
    display: flex;
    align-items: center;
    margin-right: -16px;
    button {
      flex: 0 1 50%;
      margin-right: 16px;
    }
  }

  &._wide {
    .modal {
      &__body {
        max-width: 858px;
      }
    }
  }
}
@include r($sm) {
  .modal {
    align-items: flex-end;
    &__container {
      overflow: auto;
      padding: 20px;
      height: initial;
      border-radius: 15px 15px;
    }
    &__close {
      right: 15px;
      top: 15px;
    }
  }
}
</style>
