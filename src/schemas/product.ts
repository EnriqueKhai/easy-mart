export type ProductItem = {
    id: string
    name: string
    price: number
    stock: number
}


export type ProductKey = Pick<ProductItem, 'id'>


export type ProductSchema = {
    key: ProductKey
    item: ProductItem
}
