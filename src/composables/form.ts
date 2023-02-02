import { toast } from '@zerodevx/svelte-toast'
import { useCatchError } from '@/composables'
import { useApi } from '@/core/api'

export interface IUseForm {
  urlPrev: string
  urlNext: string
}

export const useFormNav = ({ urlPrev, urlNext }: IUseForm) => {
  let loadingNext = false
  let loadingBack = false
  let requestError = null

  const requestPrev = async (data: any) => {
    console.log('👽 request', data)
    loadingBack = true

    const res = await useApi(urlPrev, {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        useCatchError(err)
        requestError = err.message
      })

    loadingBack = false

    return res
  }

  const requestNext = async (data: any) => {
    console.log('👽 request', data)
    loadingNext = true

    const res = await useApi(urlNext, {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        useCatchError(err)
        requestError = err.message
      })

    loadingNext = false

    return res
  }

  if (requestError) {
    toast.push('Ошибка, попробуйте еще раз или обратитесь к администратору')
  }

  return {
    requestError,
    loadingNext,
    loadingBack,
    requestPrev,
    requestNext,
  }
}
