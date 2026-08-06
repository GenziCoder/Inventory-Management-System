export interface UpdateProduct {

    name: string;
    description: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity: number;
    minimumStock: number;
    barcode: string;
    isActive: boolean;
    categoryId: number;


}