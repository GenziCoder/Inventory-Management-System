export interface UpdateProduct {

    productName: string;

    categoryId: number;

    supplierId: number;

    unitPrice: number;

    stockQuantity: number;

    reorderLevel: number;

    description: string;

    isActive: boolean;

}