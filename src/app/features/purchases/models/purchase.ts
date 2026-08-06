import { PurchaseItem } from './purchase-item';

export interface Purchase {

  id: number;

  purchaseNumber: string;

  supplierId: number;

  supplierName: string;

  purchaseDate: string;

  totalAmount: number;

  remarks: string;

  items: PurchaseItem[];

}