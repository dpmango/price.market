<template>
  <div class="md:mx-auto md:max-w-lg">
    <div class="mt-4">
      <UiInput
        name="text"
        type="textarea"
        placeholder="Введите текст объявления"
        rows="5"
        :maxRows="8"
        :value="text"
        :error="errors.text"
        :valid="textMeta.valid"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('text', v)"
      />
    </div>

    <div class="mt-4">
      <div class="h-20 bg-gray-100"></div>
    </div>

    <div class="mt-4">
      <UiInput
        label="Локация"
        placeholder="Локация"
        :value="location"
        :error="errors.location"
        :valid="locationMeta.valid"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('price', v)"
      />
    </div>

    <div class="mt-4 max-w-[50%]">
      <UiInput
        label="Цена"
        placeholder="1 000"
        inputmode="numeric"
        :value="price"
        :error="errors.price"
        :valid="textMeta.valid"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('price', v)"
      />
    </div>

    <div class="mt-4 flex flex-col">
      <UiButton @click="next" :loading="loadingNext" :disabled="nextDisabled"> Далее </UiButton>
      <UiButton class="mt-3" @click="prev" theme="link" :loading="loadingBack">
        Изменить категорию
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const postStore = usePostStore()
const { order } = storeToRefs(postStore)

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

const { value: location, meta: locationMeta } = useField('location', (v: any) => {
  return clearString(v) ? true : 'Выберите адрес'
})

const { value: price, meta: priceMeta } = useField('price', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const nextDisabled = computed(() => {
  return !textMeta.valid || !priceMeta.valid
})

const prev = async () => {
  await requestPrev({})
}

const next = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  await requestNext({
    text: text.value,
  })
}
</script>
