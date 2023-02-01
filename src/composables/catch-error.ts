import { toast } from '@zerodevx/svelte-toast'

export interface IUseCatchError {
  error: Error
  text?: string
  silent?: boolean
}

export const useCatchError = ({ error, text, silent }: IUseCatchError) => {
  // const { message, code } = error

  if (!silent) {
    toast.push(text || error?.message || 'Ошибка, проверьте соединение с интернетом')
  }

  // eslint-disable-next-line no-console
  console.warn(error)
}
