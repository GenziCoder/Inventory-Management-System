import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { SupplierService } from '../../../suppliers/services/supplier.service';
import { ProductService } from '../../../products/services/product.service';
import { PurchaseService } from '../../services/purchase.service';

import { Supplier } from '../../../suppliers/models/supplier';
import { Product } from '../../../products/models/product';

import { Purchase } from '../../models/purchase';
import { CreatePurchase } from '../../models/create-purchase';
import { UpdatePurchase } from '../../models/update-purchase';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.css'
})
export class PurchaseForm implements OnChanges, OnInit {

  private fb = inject(FormBuilder);

  private purchaseService = inject(PurchaseService);

  private supplierService = inject(SupplierService);

  private productService = inject(ProductService);

  private toastr = inject(ToastrService);

  saving = signal(false);

  suppliers = signal<Supplier[]>([]);

  products = signal<Product[]>([]);

  grandTotal = signal(0);

  @Input()
  purchase: Purchase | null = null;

  @Output()
  saved = new EventEmitter<void>();

  form = this.fb.group({

    //supplierId: [null, Validators.required],
    supplierId: this.fb.control<number | null>(
    null,
    Validators.required
),

    purchaseDate: [
      new Date().toISOString().substring(0, 10),
      Validators.required
    ],

    remarks: [''],

    items: this.fb.array([])

  });

  // constructor() {

  //   this.loadSuppliers();

  //   this.loadProducts();

  //   this.addItem();

  // }

  // step 1
 ngOnInit(): void {

  this.loadSuppliers();

  this.loadProducts();

  this.addItem();

}

  ngOnChanges(changes: SimpleChanges): void {

   this.loadPurchase();

  }

 save(): void {

console.log(this.form.getRawValue());

console.log(this.getPurchaseModel());

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    this.toastr.error('Please fill all required fields.');

    return;

  }

  if (!this.validateItems()) {

    return;

  }

  const model = this.getPurchaseModel();

  this.saving.set(true);

  console.log(this.form.getRawValue());

  console.log(this.getPurchaseModel());

  const request = this.purchase
      ? this.purchaseService.update(this.purchase.id, model)
      : this.purchaseService.create(model);

  request
    .pipe(
      finalize(() => this.saving.set(false))
    )
    .subscribe({

      next: message => {

        this.toastr.success(message);

        this.saved.emit();

      },

      error: error => {

        this.toastr.error(error.error ?? 'Unable to save purchase.');

      }

    });

}

  // step 2
  get items(): FormArray {

    return this.form.get('items') as FormArray;

  }

  loadSuppliers(): void {

    this.supplierService
      .getAll('', 1, 100)
      .subscribe({

        next: response => {

          this.suppliers.set(response.data);

        }

      });

  }

  loadProducts(): void {

    this.productService
      .getAll('', 1, 100)
      .subscribe({

        next: response => {

          this.products.set(response.data);

        }

      });

  }

  createItem(): FormGroup {

    return this.fb.group({

      //productId: [null, Validators.required],
      productId: this.fb.control<number | null>(
    null,
    Validators.required
    ),

      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      unitPrice: [{value: 0, disabled: false },Validators.required],

      totalPrice: [{ value: 0, disabled: true }]

    });

  }

  addItem(): void {

    this.items.push(this.createItem());
    this.calculateGrandTotal();

  }

  removeItem(index: number): void {

    if (this.items.length === 1) {

      return;

    }

    this.items.removeAt(index);

    this.calculateGrandTotal();

  }
 
  calculateGrandTotal(): void {

  let total = 0;

  this.items.controls.forEach(control => {

    const totalPrice = Number(
      control.get('totalPrice')?.value ?? 0
    );

    total += totalPrice;

  });

  this.grandTotal.set(total);

}

  onQuantityChange(index: number): void {

    this.calculateRowTotal(index);

  }
  onPriceChange(index: number): void {

    this.calculateRowTotal(index);

  }

 resetForm(): void {

  this.form.reset({

    supplierId: null,

    purchaseDate: new Date().toISOString().substring(0, 10),

    remarks: ''

  });

  this.items.clear();

  this.addItem();

  this.grandTotal.set(0);

}


  loadPurchase(): void {

    if (!this.purchase) {

      this.resetForm();

      return;

    }

    this.form.patchValue({

      supplierId: this.purchase.supplierId,

      purchaseDate: this.purchase.purchaseDate.substring(0, 10),

      remarks: this.purchase.remarks

    });

    this.items.clear();

    this.purchase.items.forEach(item => {
 
      const group = this.createItem();
      
      group.patchValue({

      productId: item.productId,

      quantity: item.quantity,

      unitPrice: item.unitPrice,

      totalPrice: item.totalPrice

    });
     this.items.push(group);
    });

    this.calculateGrandTotal();

  }
   
   private calculateRowTotal(index: number): void {

  const item = this.items.at(index) as FormGroup;

  const quantity = Number(item.get('quantity')?.value || 0);

  const unitPrice = Number(item.get('unitPrice')?.value || 0);

  const totalPrice = quantity * unitPrice;

  item.get('totalPrice')?.setValue(totalPrice, {
    emitEvent: false
  });

  this.calculateGrandTotal();

}

onProductChange(index: number): void {

  const item = this.items.at(index) as FormGroup;

  const productId = Number(item.get('productId')?.value);

  if (!productId) {

    item.patchValue({
      unitPrice: 0,
      totalPrice: 0
    });

    this.calculateGrandTotal();
    return;

  }

  const product = this.products().find(p => p.id === productId);

  if (!product) {

    return;

  }

  item.patchValue({

    unitPrice: product.purchasePrice

  });

  this.calculateRowTotal(index);

}
isProductSelected(productId: number, currentIndex: number): boolean {

  return this.items.controls.some((control, index) => {

    if (index === currentIndex) {

      return false;

    }

    return Number(control.value.productId) === productId;

  });

}

isInvalid(controlName: string): boolean {

  const control = this.form.get(controlName);

  return !!(control?.invalid && (control.touched || control.dirty));

}

private validateItems(): boolean {

  if (this.items.length === 0) {

    this.toastr.error('Please add at least one product.');

    return false;

  }

  for (const item of this.items.controls) {

    if (item.invalid) {

      item.markAllAsTouched();

      this.toastr.error('Please complete all purchase item details.');

      return false;

    }

  }

  return true;

}

private getPurchaseModel(): CreatePurchase {

  //const form = this.form.getRawValue();
  const form = this.form.getRawValue() as {
    supplierId: number;
    purchaseDate: string;
    remarks: string;
    items: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
};
  return {

    supplierId: Number(form.supplierId),

    purchaseDate: form.purchaseDate!,

    remarks: form.remarks ?? '',

    items: form.items.map(item => ({

      productId: Number(item.productId),

      quantity: Number(item.quantity),

      unitPrice: Number(item.unitPrice)

    }))

  };

}


}