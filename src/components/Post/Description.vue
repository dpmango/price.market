<template>
  <div class="pb-24 md:mx-auto md:max-w-lg md:pb-0">
    <div class="">
      <UiInput
        name="text"
        type="textarea"
        placeholder="Введите текст объявления"
        rows="8"
        :maxRows="8"
        :value="text"
        :error="errors.text"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('text', v)"
      />
    </div>

    <div class="mt-4">
      <div class="h-[60px] rounded-lg border border-dashed border-gray-200 bg-gray-50"></div>
    </div>

    <div class="mt-4">
      <UiButton
        iconLeft="location"
        theme="secondary"
        size="small"
        @click="ui.setModal({ name: 'location' })"
        v-if="!order.location.country"
      >
        Добавить локацию
      </UiButton>

      <template v-else>
        <div class="mb-1 flex items-center">
          <div class="gray-800 block text-base font-bold">Локация</div>
          <span
            class="ml-auto flex-shrink-0 cursor-pointer text-xl leading-[0] text-gray-200 transition hover:text-gray-500"
          >
            <SvgIcon name="minus-circle" />
          </span>
        </div>

        <div class="rounded-lg bg-gray-50 py-3 px-4">
          <span class="text-sm" v-if="order.location.country">{{ order.location.country }}</span>
          <span class="text-sm" v-if="order.location.city">, г. {{ order.location.city }}</span>
          <span class="text-sm text-gray-500" v-if="order.location.address">
            <br />{{ order.location.address }}
          </span>

          <div class="mt-2">
            <UiButton size="small" theme="secondary" @click="ui.setModal({ name: 'location' })">
              Изменить
            </UiButton>
          </div>
        </div>
      </template>

      <PostLocation />
    </div>

    <div class="mt-2">
      <UiButton
        iconLeft="money"
        theme="secondary"
        size="small"
        v-show="!isAddingPrice"
        @click="isAddingPrice = true"
      >
        Добавить цену
      </UiButton>

      <UiInput
        v-show="isAddingPrice"
        label="Цена"
        placeholder="1 000"
        inputmode="numeric"
        :value="price"
        :error="errors.price"
        @onChange="(v: string) => setFieldValue('price', v)"
      />
    </div>

    <div
      class="fixed left-0 bottom-0 right-0 z-[5] flex border-t border-gray-100 bg-white p-2 md:static md:mt-4 md:flex-col md:border-0 md:bg-transparent md:p-0"
    >
      <UiButton
        class="mr-2 md:hidden"
        @click="prev"
        theme="link"
        size="small"
        iconLeft="arrow-left"
        :loading="loadingNext"
      />
      <UiButton @click="next" block :loading="loadingNext"> Далее </UiButton>

      <UiButton
        class="hidden md:mt-3 md:inline-block"
        @click="prev"
        theme="link"
        size="small"
        :loading="loadingBack"
      >
        Изменить категорию
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PostLocation } from '@c/Post'

const postStore = usePostStore()
const ui = useUiStore()
const { order } = storeToRefs(postStore)

const router = useRouter()

const { requestError, loadingNext, loadingBack, requestPrev, requestNext } = useFormNav({
  url: 'step-2',
})

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    text: '',
    location: '',
    price: '',
  },
})

const { value: text, meta: textMeta } = useField('text', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

// location
const location = ref({
  country: '',
  city: '',
  address: '',
})

// price
const isAddingPrice = ref(false)

const { value: price, meta: priceMeta } = useField('price', (v: any) => {
  if (!isAddingPrice.value) return true
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const { value: currency, meta: currencyMeta } = useField('currency', (v: any) => {
  if (!isAddingPrice.value) return true
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const nextDisabled = computed(() => {
  return !textMeta.valid || !priceMeta.valid
})

const prev = async () => {
  postStore.resetOrder()
  router.push('/')
}

const next = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  await requestNext({
    content: text.value,
    attachments: ['attachment_id'],
    location: location.value,
    price: {
      currency: currency.value,
      value: price.value,
    },
  })
}
</script>
