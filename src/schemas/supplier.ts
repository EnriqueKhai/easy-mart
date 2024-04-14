export type SupplierItem = {
    uen: number
    name: string
    email: string
}


export type SupplierKey = Pick<SupplierItem, 'uen'>


export type SupplierSchema = {
    key: SupplierKey
    item: SupplierItem
}
