import { ProductSchema } from "../schemas/product";
import { SupplierSchema } from "../schemas/supplier";


export const Table = {
    PRODUCTS: 'products',
    SUPPLIERS: 'suppliers',
} as const;


export type Schema = {
    [Table.PRODUCTS]: ProductSchema
    [Table.SUPPLIERS]: SupplierSchema
}


// ensure all table names have a corresponding schema
type _ = Schema[(typeof Table)[keyof typeof Table]]
