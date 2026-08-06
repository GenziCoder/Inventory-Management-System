export interface Sale {

  id: number;

  invoiceNumber: string;

  customerId: number;

  customerName: string;

  saleDate: string;

  totalAmount: number;

  remarks: string;

  items: SaleItem[];

}

export interface SaleItem {

  id?: number;

  productId: number;

  productName?: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

}