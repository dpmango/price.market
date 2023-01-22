<template>
  <div class="pb-24 md:mx-auto md:max-w-lg md:pb-0">
    <div class="">
      <UiInput
        name="text"
        type="textarea"
        placeholder="Введите текст объявления"
        rows="8"
        :maxRows="8"
        :maxCount="1500"
        :value="text"
        :error="errors.text"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('text', v)"
      />
    </div>

    <div class="mt-4">
      <div class="h-[60px] rounded-lg border border-dashed border-gray-200 bg-gray-50"></div>
    </div>

    <!-- location-->
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
        <AtomBlockNav title="Локация" @onMinusClick="postStore.resetLocation()" />

        <AtomLocation
          :location="order.location"
          @onChangeRequest="ui.setModal({ name: 'location' })"
        />
      </template>

      <PostLocation />
    </div>

    <!-- price-->
    <div class="mt-4" :class="[!hasPrice && 'mt-2']">
      <UiButton
        iconLeft="money"
        theme="secondary"
        size="small"
        v-show="!hasPrice"
        @click="hasPrice = true"
      >
        Добавить цену
      </UiButton>

      <UiInput
        v-show="hasPrice"
        label="Цена"
        placeholder="1 000"
        inputmode="numeric"
        :value="price"
        :error="errors.price"
        @onChange="(v: string) => setFieldValue('price', v)"
      />
    </div>

    <!-- nav-->
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
      <UiButton @click="next" block :loading="loadingNext" :disabled="nextDisabled">
        Далее
      </UiButton>

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
import { AtomBlockNav } from '../Ui'

const postStore = usePostStore()
const ui = useUiStore()
const { order } = storeToRefs(postStore)

const router = useRouter()
const route = useRoute()

// form constructor
const { requestError, loadingNext, loadingBack, requestPrev, requestNext } = useFormNav({
  urlNext: 'post',
  urlPrev: '',
})

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    text: order.value.text || '',
    price: order.value.price.value || '',
    currenct: order.value.price.currency || '',
  },
})

const { value: text, meta: textMeta } = useField('text', (v: any) => {
  const value = clearString(v)
  if (!value.length) return 'Текст обязателен для заполнения'
  if (value.length < 10) return 'Минимум 10 знаков'
  return true
})

// price
const hasPrice = ref(false)

const { value: price, meta: priceMeta } = useField('price', (v: any) => {
  if (!hasPrice.value) return true
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const { value: currency, meta: currencyMeta } = useField('currency', (v: any) => {
  if (!hasPrice.value) return true
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

// navigation
const nextDisabled = computed(() => {
  return !textMeta.valid
})

const prev = async () => {
  postStore.resetOrder()
  router.push('/')
}

const next = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  const data = await requestNext({
    content: text.value,
    attachments: ['attachment_id'],
    location: order.value.location,
    price: {
      currency: currency.value,
      value: price.value,
    },
  })

  router.push(`/create/${route.params.id}/${data.id}`)
}
</script>
