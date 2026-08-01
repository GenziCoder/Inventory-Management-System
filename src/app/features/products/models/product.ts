export interface Product {

    id: number;

    productCode: string;

    name: string;

    description: string;

    purchasePrice: number;

    sellingPrice: number;

    stockQuantity: number;

    minimumStock: number;

    barcode: string;

    isActive: boolean;

    categoryId: number;

    categoryName: string;

}