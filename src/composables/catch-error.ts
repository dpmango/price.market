import { useToast } from 'vue-toast-notification'

export interface IUseCatchError {
  error: Error
  text?: string
  silent?: boolean
}

export const useCatchError = ({ error, text, silent }: IUseCatchError) => {
  // const { message, code } = error
  const toast = useToast()

  if (!silent) {
    toast.error(text || error?.message || 'Ошибка, проверьте соединение с интернетом')
  }

  // eslint-disable-next-line no-console
  console.warn(error)
}
