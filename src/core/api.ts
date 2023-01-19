import { ofetch } from 'ofetch'

export const useApi = async (url: string, options = {}) => {
  const fetchUrl = `${import.meta.env.VITE_API_URL}/${url}`

  return ofetch(fetchUrl, options)
    .then((res) => {
      console.log(`👌 +FETCH ${url}`, res)
      return res
    })
    .catch((err) => {
      console.error(`❌ (err) FETCH ${url}`, err)
      throw err
    })
}
