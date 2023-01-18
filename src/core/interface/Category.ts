export interface ICategoryDto {
  id: number
  parent_id: number | null
  name: string
  emoji: string
}

export interface ICategoryChilds extends ICategoryDto {
  childs: ICategoryChilds[]
}
