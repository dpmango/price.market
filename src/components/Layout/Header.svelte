<script lang="ts">
  import cns from 'classnames'
  import { page } from '$app/stores'
  import { SvgIcon } from '@c/Ui'
  import logoImage from '$lib/img/logo.svg'

  import { setMobileMenu, mobileMenuActive } from '@/core/store/ui'

  // const ui = useUiStore()

  // const headerRef = ref<HTMLElement | null>(null)

  const menuList = [
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
      to: '/ui',
      icon: 'heart',
    },
  ]

  const toggleMobile = () => {
    setMobileMenu({ active: !$mobileMenuActive })
  }
</script>

<header class="header border-b border-gray-100 py-0.5 md:py-px" data-ref="headerRef">
  <div class="container">
    <div class="flex items-center">
      <a href="/" class="pr-2">
        <img src={logoImage} alt="logo" />
      </a>

      <div class="ml-auto -mr-2 hidden items-center md:flex">
        {#each menuList as li, idx}
          <a
            href="/"
            class="flex items-center px-2 py-4 text-gray-500 transition last:mr-0 hover:text-blue-900 lg:mr-3"
          >
            {#if li.icon}
              <SvgIcon name={li.icon} classname="text-xl" />
            {/if}
            {#if li.label}
              <span class={cns(li.icon && 'pl-1', 'text-sm font-bold')}>
                {li.label}
              </span>
            {/if}
          </a>
        {/each}
      </div>

      <div class="ml-auto -mr-2 cursor-pointer py-4 px-2 md:hidden" on:click={toggleMobile}>
        <div class={cns('hamburger', $mobileMenuActive && '_active')}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  </div>
</header>
