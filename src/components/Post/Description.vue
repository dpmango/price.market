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
      >
        Добавить локацию
      </UiButton>

      <UiModal name="location">
        <PostLocation />
      </UiModal>
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

// price
const isAddingPrice = ref(false)

const { value: price, meta: priceMeta } = useField('price', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const { value: currency, meta: currencyMeta } = useField('currency', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const location = ref({
  country: '',
  city: '',
  address: '',
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
