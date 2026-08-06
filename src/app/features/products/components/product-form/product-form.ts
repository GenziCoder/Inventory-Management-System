import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CreateProduct } from '../../models/create-product';
import { UpdateProduct } from '../../models/update-product';

import { CategoryService } from '../../../categories/services/category.service';
import { SupplierService } from '../../../suppliers/services/supplier.service';

import { Category } from '../../../categories/models/category';
import { Supplier } from '../../../suppliers/models/supplier';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnChanges {

  private fb = inject(FormBuilder);

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private supplierService = inject(SupplierService);

  private toastr = inject(ToastrService);

  saving = signal(false);

  categories = signal<Category[]>([]);

  suppliers = signal<Supplier[]>([]);

  @Input()
  product: Product | null = null;

  @Output()
  saved = new EventEmitter<void>();

  form = this.fb.group({

    productCode: ['', Validators.required],

    name: ['', Validators.required],

    description: [''],
    purchasePrice: [0, Validators.required],

    sellingPrice: [0, Validators.required],

    stockQuantity: [0, Validators.required],

    minimumStock: [0, Validators.required],

    barcode: [''],
    isActive: [true],

    categoryId: [0, Validators.required],

    categoryName: ['']


  });

  constructor() {

    this.loadCategories();

    this.loadSuppliers();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.product) {

      this.form.patchValue(this.product);

      this.form.controls.productCode.disable();

    }
    else {

      this.form.reset({

        categoryId: 0,
        categoryName: ''

      });

      this.form.controls.productCode.enable();

    }

  }

  loadCategories() {

    this.categoryService
      .getAll('', 1, 10)
      .subscribe({

        next: response => {

          this.categories.set(response.data);

        }

      });

  }

  loadSuppliers() {

    this.supplierService
      .getAll('', 1, 10)
      .subscribe({

        next: response => {

          this.suppliers.set(response.data);

        }

      });

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.product) {

      const value = this.form.getRawValue();

      const model: UpdateProduct = {

        name: value.name!,

        description: value.description ?? '',

        purchasePrice: Number(value.purchasePrice),

        sellingPrice: Number(value.sellingPrice),

        stockQuantity: Number(value.stockQuantity),

        minimumStock: Number(value.minimumStock),

        barcode: value.barcode ?? '',

        categoryId: Number(value.categoryId),
        isActive: value.isActive ?? true

      };

      this.saving.set(true);

      this.productService
        .update(this.product.id, model)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({

          next: message => {

            this.toastr.success(message);

            this.saved.emit();

          }

        });

    }
    else {

      const value = this.form.getRawValue();

      const model: CreateProduct = {

        productCode: value.productCode!,

        name: value.name!,

        description: value.description ?? '',

        purchasePrice: Number(value.purchasePrice),

        sellingPrice: Number(value.sellingPrice),

        stockQuantity: Number(value.stockQuantity),

        minimumStock: Number(value.minimumStock),

        barcode: value.barcode ?? '',

        categoryId: Number(value.categoryId)

      };



      this.saving.set(true);

      this.productService
        .create(model)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({

          next: message => {

            this.toastr.success(message);

            this.saved.emit();

            this.form.reset({

              productCode: '',

              name: '',

              categoryId: 0,

              purchasePrice: 0,

              sellingPrice: 0,

              stockQuantity: 0,

              minimumStock: 0,

              barcode: '',

              description: ''

            });

          },
          error: message => {

            this.toastr.error(message.error?.title || 'Failed to create product');

          }

        });

    }

  }

}