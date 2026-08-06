export interface PurchaseItem {

  id?: number;

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  totalPrice?: number;

}