

export interface CreatePurchase {

  supplierId: number;

  purchaseDate: string;

  remarks: string;

  items: CreatePurchaseItem[];

}

export interface CreatePurchaseItem {

  productId: number;

  quantity: number;

  unitPrice: number;

}