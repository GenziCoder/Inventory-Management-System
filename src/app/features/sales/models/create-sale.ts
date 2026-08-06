export interface CreateSale {

  customerId: number;

  saleDate: string;

  remarks: string;

  items: CreateSaleItem[];

}

export interface CreateSaleItem {

  productId: number;

  quantity: number;

  unitPrice: number;

}