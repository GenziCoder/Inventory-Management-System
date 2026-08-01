export interface CreateProduct {

    productCode: string;

    productName: string;

    categoryId: number;

    supplierId: number;

    unitPrice: number;

    stockQuantity: number;

    reorderLevel: number;

    description: string;

}