import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
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

import { CustomerService } from '../../../customers/services/customer.service';
import { ProductService } from '../../../products/services/product.service';
import { SaleService } from '../../services/sale.service';

import { Customer } from '../../../customers/models/customer';
import { Product } from '../../../products/models/product';

import { Sale } from '../../models/sale';
import { CreateSale } from '../../models/create-sale';
import { UpdateSale } from '../../models/update-sale';
@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.css'
})
export class SaleForm implements OnInit, OnChanges {
private readonly fb = inject(FormBuilder);

private readonly saleService = inject(SaleService);

private readonly customerService = inject(CustomerService);

private readonly productService = inject(ProductService);

private readonly toastr = inject(ToastrService);
readonly saving = signal(false);

readonly customers = signal<Customer[]>([]);

readonly products = signal<Product[]>([]);

readonly grandTotal = signal(0); 

@Input()
sale: Sale | null = null;

@Output()
saved = new EventEmitter<void>();

form = this.fb.group({

  customerId: [0, Validators.required],

  saleDate: [
    new Date().toISOString().substring(0,10),
    Validators.required
  ],

  remarks: [''],

  items: this.fb.array([])

});

get items(): FormArray {

  return this.form.get('items') as FormArray;

}

ngOnInit(): void {

  this.loadCustomers();

  this.loadProducts();

  this.addItem();

}

ngOnChanges(changes: SimpleChanges): void {

  if (changes['sale']) {

    this.loadSale();

  }

}

private loadCustomers(): void {

  this.customerService
      .getAll('',1,1000)
      .subscribe({

          next: response => {

              this.customers.set(response.data);

          }

      });

}

private loadProducts(): void {

  this.productService
      .getAll('',1,1000)
      .subscribe({

          next: response => {

              this.products.set(response.data);

          }

      });

}

private createItem(): FormGroup {

  return this.fb.group({

      productId: [0, Validators.required],

      quantity: [
          1,
          [
              Validators.required,
              Validators.min(1)
          ]
      ],

      unitPrice: [
          0,
          Validators.required
      ],

      totalPrice: [
          {
              value:0,
              disabled:true
          }
      ]

  });

}

addItem(): void {

  this.items.push(

      this.createItem()

  );

}

removeItem(index:number):void{

    if(this.items.length===1){

        return;

    }

    this.items.removeAt(index);

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

  const product = this.products()
      .find(x => x.id === productId);

  if (!product) {

    return;

  }

  item.patchValue({

    unitPrice: product.sellingPrice

  });

  this.calculateRowTotal(index);

}

onQuantityChange(index: number): void {

    this.calculateRowTotal(index);

}

onPriceChange(index: number): void {

    this.calculateRowTotal(index);

}

private calculateRowTotal(index: number): void {

    const item = this.items.at(index) as FormGroup;

    const quantity =
        Number(item.get('quantity')?.value) || 0;

    const price =
        Number(item.get('unitPrice')?.value) || 0;

    item.patchValue({

        totalPrice: quantity * price

    },{
        emitEvent:false
    });

    this.calculateGrandTotal();

}

private calculateGrandTotal(): void {

    let total = 0;

    this.items.controls.forEach(control=>{

        total += Number(
            control.get('totalPrice')?.value
        ) || 0;

    });

    this.grandTotal.set(total);

}

isProductSelected(
    productId:number,
    currentIndex:number):boolean{

    return this.items.controls.some((control,index)=>{

        if(index===currentIndex){

            return false;

        }

        return Number(control.value.productId)===productId;

    });

}
isInvalid(controlName:string):boolean{

    const control=this.form.get(controlName);

    return !!(
        control?.invalid &&
        (control.touched || control.dirty)
    );

}

private validateItems():boolean{

    if(this.items.length===0){

        this.toastr.error(
            'Please add at least one product.'
        );

        return false;

    }

    for(const item of this.items.controls){

        if(item.invalid){

            item.markAllAsTouched();

            this.toastr.error(
                'Please complete all item details.'
            );

            return false;

        }

    }

    return true;

}
private getSaleModel():CreateSale{

    return{

        customerId:Number(
            this.form.value.customerId
        ),

        saleDate:
            this.form.value.saleDate!,

        remarks:
            this.form.value.remarks ?? '',

        items:this.items.controls.map(control=>({

            productId:Number(
                control.value.productId
            ),

            quantity:Number(
                control.value.quantity
            ),

            unitPrice:Number(
                control.value.unitPrice
            )

        }))

    };

}

private loadSale():void{

    if(!this.sale){

        this.resetForm();

        return;

    }

    this.form.patchValue({

        customerId:this.sale.customerId,

        saleDate:this.sale.saleDate.substring(0,10),

        remarks:this.sale.remarks

    });

    this.items.clear();

    this.sale.items.forEach(item=>{

        const group=this.createItem();

        group.patchValue({

            productId:item.productId,

            quantity:item.quantity,

            unitPrice:item.unitPrice,

            totalPrice:item.totalPrice

        });

        this.items.push(group);

    });

    this.calculateGrandTotal();

}
private resetForm():void{

    this.form.reset({

        customerId:0,

        saleDate:
            new Date().toISOString().substring(0,10),

        remarks:''

    });

    this.items.clear();

    this.addItem();

    this.grandTotal.set(0);

}

save(): void {

  console.log('SAVE CLICKED');

  console.log(this.form.valid);

  console.log(this.form.getRawValue());

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    this.toastr.error('Please fill all required fields.');

    return;

  }

  if (!this.validateItems()) {

    return;

  }

  const model = this.getSaleModel();

  this.saving.set(true);

  const request = this.sale
    ? this.saleService.update(this.sale.id, model as UpdateSale)
    : this.saleService.create(model);

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

        this.toastr.error(error.error);

      }

    });

}
// private getSaleModel(): CreateSale | UpdateSale {

//     return {

//         customerId: Number(this.form.value.customerId),

//         saleDate: this.form.value.saleDate!,

//         remarks: this.form.value.remarks ?? '',

//         items: this.items.controls.map(control => ({

//             productId: Number(control.value.productId),

//             quantity: Number(control.value.quantity),

//             unitPrice: Number(control.value.unitPrice)

//         }))

//     };

// }

getStockQuantity(productId: number): number {

  const product = this.products().find(x => x.id === productId);

  return product?.stockQuantity ?? 0;

}


}