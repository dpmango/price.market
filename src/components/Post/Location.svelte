<script lang="ts">
  import { form, field } from 'svelte-forms'
  import { toast } from '@zerodevx/svelte-toast'

  import { useApi } from '@/core/api'
  import { clearString, valid_adress } from '@/core/utils'
  import { updateOrder, order } from '@/core/store/post'
  import { closeAllModals } from '@/core/store/ui'
  import { UiModal, UiInput, UiButton } from '@c/Ui'

  // const { errors, setErrors, setFieldValue, validate } = useForm({
  //   initialValues: {
  //     country: $order.location.country || '',
  //     city: $order.location.city || '',
  //     address: $order.location.address || '',
  //   },
  // })

  const country = field('country', '', [
    (v) => {
      return {
        valid: !!clearString(v),
        name: 'Текст обязателен для заполнения',
      }
    },
  ])

  const city = field('city', '', [
    (v) => {
      return { valid: true, name: '' }
    },
  ])

  const address = field('address', '', [
    (v) => {
      if (!clearString(v)) return { valid: true, name: '' }
      return {
        valid: valid_adress(v),
        name: 'Укажите полный адрес, с номером дома и/или квартиры',
      }
    },
  ])

  const formInstance = form(country, city, address)

  let loading = false

  const save = async () => {
    const { valid, errors } = $formInstance
    if (!valid) return

    loading = true
    updateOrder({
      location: {
        country: $country.value,
        city: $city.value,
        address: $address.value,
      },
    })
    // await useApi('/save/', {
    //   method: 'POST',
    //   body: {
    //     country: country,
    //     city: city,
    //     address: address,
    //   },
    // }).catch((err) => {
    //   toast.push(err)
    // })

    loading = false

    closeAllModals()
  }
</script>

<UiModal name="location" title="Добавить локацию">
  <div class="mt-4">
    <UiInput
      name="country"
      label={'Страна'}
      placeholder=""
      value={$country.value}
      error={$country.errors[0]}
      focusOnMount={true}
      on:onChange={(v) => ($country.value = v.detail)}
    />
  </div>

  <div class="mt-4">
    <UiInput
      name="city"
      label={'Город'}
      placeholder=""
      optional={true}
      value={$city.value}
      error={$city.errors[0]}
      on:onChange={(v) => ($city.value = v.detail)}
    />
  </div>

  <div class="mt-4">
    <UiInput
      name="address"
      label={'Адрес'}
      placeholder="Введите текст объявления"
      optional={true}
      value={$address.value}
      error={$address.errors[0]}
      on:onChange={(v) => ($address.value = v.detail)}
    />
  </div>

  <div class="mt-4">
    <UiButton on:click={save} block :loading="loading">Продолжить</UiButton>
  </div>
</UiModal>
