
export interface UpdatePurchase {

  supplierId: number;

  purchaseDate: string;

  remarks: string;

  items: UpdatePurchaseItem[];

}

export interface UpdatePurchaseItem {

  productId: number;

  quantity: number;

  unitPrice: number;

}