export interface IOrder {
  categoryId: number | null
  text: string
  price: {
    currency: string
    value: number
  }
  location: {
    country: string
    city: string
    address: string
  }
}
