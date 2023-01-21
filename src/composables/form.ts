import { useToast } from 'vue-toast-notification'
export interface IUseForm {
  url: string
}

export const useFormNav = ({ url }: IUseForm) => {
  const api = useApi
  const toast = useToast()

  const loadingNext = ref(false)
  const loadingBack = ref(false)
  const requestError = ref(null)

  const requestPrev = async (data) => {
    console.log('👽 request', data)
    loadingBack.value = true

    const res = await api(`order/${url}/back`, {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        useCatchError(err)
        requestError.value = err.message
      })

    loadingBack.value = false

    return res
  }

  const requestNext = async (data) => {
    console.log('👽 request', data)
    loadingNext.value = true

    const res = await api(`order/${url}/next`, {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        useCatchError(err)
        requestError.value = err.message
      })

    loadingNext.value = false

    return res
  }

  if (requestError.value) {
    toast.error('Ошибка, попробуйте еще раз или обратитесь к администратору')
  }

  return {
    requestError,
    loadingNext,
    loadingBack,
    requestPrev,
    requestNext,
  }
}
