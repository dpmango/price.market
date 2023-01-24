import type { ISelect } from './Ui'

export interface IOrder {
  categoryId: number | null
  text: string
  price: {
    currency: ISelect
    value: number
  }
  location: {
    country: string
    city: string
    address: string
  }
}
