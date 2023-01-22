<template>
  <UiModal name="location" title="Добавить локацию">
    <div class="mt-4">
      <UiInput
        name="country"
        label="Страна"
        placeholder=""
        :value="country"
        :error="errors.country"
        :focusOnMount="true"
        @onChange="(v: string) => setFieldValue('country', v)"
      />
    </div>

    <div class="mt-4">
      <UiInput
        name="city"
        label="Город"
        placeholder=""
        :value="city"
        @onChange="(v: string) => setFieldValue('city', v)"
      />
    </div>

    <div class="mt-4">
      <UiInput
        name="address"
        label="Адрес"
        placeholder="Введите текст объявления"
        :value="address"
        @onChange="(v: string) => setFieldValue('address', v)"
      />
    </div>

    <UiButton @click="save" :loading="loading"> Далее </UiButton>
  </UiModal>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toast-notification'

const ui = useUiStore()
const toast = useToast()

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    country: '',
    city: '',
    address: '',
  },
})

const { value: country, meta: countryMeta } = useField('country', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})
const { value: city, meta: cityMeta } = useField('city', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})
const { value: address, meta: addressMeta } = useField('address', (v: any) => {
  return clearString(v) ? true : 'Текст обязателен для заполнения'
})

const loading = ref(false)

const save = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  loading.value = true
  await useApi('/save/', {
    method: 'POST',
    body: {
      country: country.value,
      city: city.value,
      address: address.value,
    },
  }).catch((err) => {
    toast.error(err)
  })

  loading.value = false

  ui.closeAllModals()
}
</script>
