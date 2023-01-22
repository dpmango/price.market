export interface IOrder {
  categoryId: number | null
  location: {
    country: string | null
    city: string | null
    address: string | null
  }
}
