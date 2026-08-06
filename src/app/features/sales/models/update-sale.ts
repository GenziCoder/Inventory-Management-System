export interface UpdateSale {

  customerId: number;

  saleDate: string;

  remarks: string;

  items: UpdateSaleItem[];

}

export interface UpdateSaleItem {

  productId: number;

  quantity: number;

  unitPrice: number;

}