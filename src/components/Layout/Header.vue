<template>
  <header class="header border-b border-gray-100 py-0.5 md:py-px" ref="headerRef">
    <div class="container">
      <div class="flex items-center">
        <RouterLink to="/" class="pr-2">
          <img src="@/assets/img/logo.svg" alt="logo" />
        </RouterLink>

        <div class="ml-auto -mr-2 hidden items-center md:flex">
          <RouterLink
            to="/"
            class="flex items-center px-2 py-4 text-gray-500 transition last:mr-0 hover:text-blue-900 lg:mr-3"
            v-for="(li, idx) in menuList"
            :key="idx"
          >
            <SvgIcon v-if="li.icon" :name="li.icon" class="text-xl" />
            <span v-if="li.label" :class="[li.icon && 'pl-1', 'text-sm font-bold']">
              {{ li.label }}
            </span>
          </RouterLink>
        </div>

        <div class="ml-auto -mr-2 cursor-pointer py-4 px-2 md:hidden" @click="toggleMobile">
          <div :class="['hamburger', ui.mobileMenuActive && '_active']">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const ui = useUiStore()

const headerRef = ref<HTMLElement | null>(null)

const menuList = ref([
  {
    to: '/',
    icon: 'collection',
    label: 'Заказы',
  },
  {
    to: '/',
    icon: 'factory',
    label: 'Компании',
  },
  {
    to: '/',
    icon: 'chat',
    label: 'Сообщения',
  },
  {
    to: '/',
    label: 'Профиль',
  },
  {
    to: '/',
    icon: 'heart',
  },
])

const toggleMobile = () => {
  const headerHeight = headerRef.value?.offsetHeight
  ui.setMobileMenu({ active: !ui.mobileMenuActive, offset: headerHeight || 0 })
}
</script>
