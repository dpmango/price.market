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
      <UiUploader
        :initialFiles="attachments"
        @onUploads="(v: string[]) => (uploades = v)"
        @onChange="(v: IFile[]) => (attachments = v)"
      />
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

      <div class="flex items-end" v-show="hasPrice">
        <div class="relative">
          <UiInput
            inputClass="combobox"
            label="Цена"
            placeholder="1 000"
            type="number"
            inputmode="numeric"
            :value="price"
            :error="!!errors.price"
            @onChange="(v: string) => setFieldValue('price', v)"
          />
          <div class="absolute right-0 top-7 z-[3]">
            <UiSelect
              :value="currency"
              :error="errors.currency"
              :options="currencyOptions"
              @onSelect="handleSelectChange"
            />
          </div>
        </div>

        <span
          @click="handlePriceReset"
          class="mb-3 ml-2 flex-shrink-0 cursor-pointer text-xl leading-[0] text-gray-200 transition hover:text-gray-500"
        >
          <SvgIcon name="minus-circle" />
        </span>
      </div>
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
import { AtomBlockNav } from '@c/Ui'
import type { IFile, ISelect } from '@/core/interface/Ui'
import type { IOrder } from '@/core/interface/Order'

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
    currency: order.value.price.currency || null,
  },
})

const { value: text, meta: textMeta } = useField('text', (v: any) => {
  const value = clearString(v)
  if (!value.length) return 'Описние обязательно для заполнения'
  if (value.length < 10) return 'Минимум 10 знаков'
  return true
})

// filepond (uploader)
const attachments = ref<IFile[]>([])
const uploades = ref<string[]>([])

// price
const hasPrice = ref(false)

const { value: price, meta: priceMeta } = useField('price', (v: any) => {
  if (!hasPrice.value) return true
  if (!isValidNumber(v)) return 'Укажите только цифры'
  return clearString(v) ? true : 'Укажите цену'
})

const { value: currency, meta: currencyMeta } = useField(
  'currency',
  (v: ISelect) => {
    if (!hasPrice.value) return true
    return clearString(v.value) ? true : 'Выберите валюту'
  },
  {
    type: 'file',
  }
)

const currencyOptions = computed(() => {
  return [
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
})

const handleSelectChange = (v: ISelect) => {
  setFieldValue('currency', v)
}

const handlePriceReset = () => {
  // postStore.resetPrice()
  hasPrice.value = false
}

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

  const orderUpdate = {
    content: text.value,
    attachments: uploades.value || [],
    location: order.value.location,
    price: {
      currency: currency.value.value as string,
      value: price.value || '',
    },
  }

  const data = await requestNext(orderUpdate)

  postStore.updateOrder({
    ...orderUpdate,
    price: {
      ...orderUpdate.price,
      currency: currency.value,
    },
  })
  router.push(`/create/${route.params.id}/${data.id}`)
}
</script>
