<script lang="ts">
  import cns from 'classnames'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { form, field } from 'svelte-forms'

  import { PostLocation } from '@c/Post'
  import {
    AtomBlockNav,
    AtomLocation,
    UiSelect,
    UiButton,
    UiInput,
    UiUploader,
    SvgIcon,
  } from '@c/Ui'
  import type { IFile, ISelect } from '@/core/interface/Ui'
  import { clearString, isValidNumber } from '@/core/utils'
  import { useFormNav } from '@/composables'

  import { order, resetOrder, updateOrder, resetLocation } from '@/core/store/post'
  import { setModal } from '@/core/store/ui'

  // form constructor
  const { loadingNext, loadingBack, requestNext } = useFormNav({
    urlNext: 'post',
    urlPrev: '',
  })

  const text = field('text', $order.text || '', [
    (v) => {
      const value = clearString(v)
      let isValid = true
      let text = ''
      if (!value.length) {
        isValid = false
        text = 'Описние обязательно для заполнения'
      }
      if (value.length < 10) {
        isValid = false
        text = 'Минимум 10 знаков'
      }

      return { valid: isValid, name: text }
    },
  ])

  // filepond (uploader)
  let attachments = [] as IFile[]
  let uploades = [] as string[]

  // price
  let hasPrice = false

  const price = field('price', $order.price.value.toString() || '', [
    (v) => {
      let isValid
      let text = 'Укажите цену'
      if (!hasPrice) isValid = true
      if (!isValidNumber(v)) {
        isValid = false
        text = 'Укажите только цифры'
      }

      isValid = !!clearString(v)

      return { valid: isValid, name: text }
    },
  ])

  const currency = field('currency', $order.price.currency || '', [
    (v) => {
      let isValid = true
      if (!hasPrice) isValid = true
      isValid = !!clearString(v.value)

      return { valid: isValid, name: 'Выберите валюту' }
    },
  ])

  $: currencyOptions = [
    {
      label: 'Рублей',
      value: 'RUB',
    },
    {
      label: 'Долларов',
      value: 'USD',
    },
    {
      label: 'Евро',
      value: 'EUR',
    },
  ]

  const handleSelectChange = (e: CustomEvent<ISelect>) => {
    $currency.value = e.detail
  }

  const handlePriceReset = () => {
    // postStore.resetPrice()
    hasPrice = false
  }

  const formInstance = form(text, price, currency)

  // navigation
  $: nextDisabled = !$formInstance.valid

  const prev = async () => {
    resetOrder()
    goto('/')
  }

  const next = async () => {
    const { valid, errors } = $formInstance
    if (!valid) return

    const orderUpdate = {
      content: text,
      attachments: uploades || [],
      location: $order.location,
      price: {
        currency: $currency.value.value || '',
        value: $price.value || '',
      },
    }

    const data = await requestNext(orderUpdate)

    updateOrder({
      ...orderUpdate,
      price: {
        value: +$price.value || 0,
        currency: $currency.value,
      },
    })
    goto(`/create/${$page.params.id}/${data.id}`)
  }
</script>

<div class="pb-24 md:mx-auto md:max-w-lg md:pb-0">
  <div class="">
    <UiInput
      name="text"
      type="textarea"
      placeholder="Введите текст объявления"
      rows={8}
      maxRows={8}
      maxCount={1500}
      value={$text.value}
      error={$text.errors[0]}
      focusOnMount={true}
      on:onChange={(v) => {
        $text.value = v.detail
      }}
    />
  </div>

  <div class="mt-4">
    <UiUploader
      initialFiles={attachments}
      on:onUploads={(e) => (uploades = e.detail)}
      on:onChange={(e) => (attachments = e.detail)}
    />
  </div>

  <!-- location-->
  <div class="mt-4">
    {#if !$order.location.country}
      <UiButton
        iconLeft="location"
        theme="secondary"
        size="small"
        on:click={() => setModal({ name: 'location' })}
      >
        Добавить локацию
      </UiButton>
    {:else}
      <AtomBlockNav title="Локация" on:onMinusClick={() => resetLocation()} />

      <AtomLocation
        location={$order.location}
        on:onChangeRequest={() => setModal({ name: 'location' })}
      />
    {/if}

    <PostLocation />
  </div>

  <!-- price-->
  <div class={cns('mt-4', !hasPrice && 'mt-2')}>
    {#if !hasPrice}
      <UiButton iconLeft="money" theme="secondary" size="small" on:click={() => (hasPrice = true)}>
        Добавить цену
      </UiButton>
    {:else}
      <div class="flex items-end">
        <div class="relative">
          <UiInput
            inputClass="combobox"
            label="Цена"
            placeholder="1 000"
            type="number"
            inputmode="numeric"
            value={$price.value}
            error={!!$price.errors[0]}
            on:onChange={(v) => ($price.value = v.detail)}
          />
          <div class="absolute right-0 top-7 z-[3]">
            <UiSelect
              value={$currency.value}
              error={$currency.errors[0]}
              options={currencyOptions}
              on:onSelect={handleSelectChange}
            />
          </div>
        </div>

        <span
          on:click={handlePriceReset}
          class="mb-3 ml-2 flex-shrink-0 cursor-pointer text-xl leading-[0] text-gray-200 transition hover:text-gray-500"
        >
          <SvgIcon name="minus-circle" />
        </span>
      </div>
    {/if}
  </div>

  <!-- nav-->
  <div
    class="fixed left-0 bottom-0 right-0 z-[5] flex border-t border-gray-100 bg-white p-2 md:static md:mt-4 md:flex-col md:border-0 md:bg-transparent md:p-0"
  >
    <UiButton
      class="mr-2 md:hidden"
      on:click={prev}
      theme="link"
      size="small"
      iconLeft="arrow-left"
      loading={loadingNext}
    />
    <UiButton on:click={next} block loading={loadingNext} :disabled={nextDisabled}>Далее</UiButton>

    <UiButton
      class="hidden md:mt-3 md:inline-block"
      on:click={prev}
      theme="link"
      size="small"
      loading={loadingBack}
    >
      Изменить категорию
    </UiButton>
  </div>
</div>
