// export interface CreateProduct {

//     productCode: string;

//     productName: string;

//     categoryId: number;

//     supplierId: number;

//     unitPrice: number;

//     stockQuantity: number;

//     reorderLevel: number;

//     description: string;

// }

export interface CreateProduct {

    productCode: string;

    name: string;

    description?: string;

    purchasePrice: number;

    sellingPrice: number;

    stockQuantity: number;

    minimumStock: number;

    barcode?: string;

    categoryId: number;

}