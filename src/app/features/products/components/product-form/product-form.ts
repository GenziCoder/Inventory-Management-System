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

    productName: ['', Validators.required],

    categoryId: [0, Validators.required],

    supplierId: [0, Validators.required],

    unitPrice: [0, [Validators.required, Validators.min(0)]],

    stockQuantity: [0, [Validators.required, Validators.min(0)]],

    reorderLevel: [0, [Validators.required, Validators.min(0)]],

    description: [''],

    isActive: [true]

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

        supplierId: 0,

        unitPrice: 0,

        stockQuantity: 0,

        reorderLevel: 0,

        isActive: true

      });

      this.form.controls.productCode.enable();

    }

  }

  loadCategories() {

    this.categoryService
      .getAll('', 1, 1000)
      .subscribe({

        next: response => {

          this.categories.set(response.data);

        }

      });

  }

  loadSuppliers() {

    this.supplierService
      .getAll('', 1, 1000)
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

      const model: UpdateProduct = {

        productName: this.form.getRawValue().productName!,

        categoryId: this.form.getRawValue().categoryId!,

        supplierId: this.form.getRawValue().supplierId!,

        unitPrice: this.form.getRawValue().unitPrice!,

        stockQuantity: this.form.getRawValue().stockQuantity!,

        reorderLevel: this.form.getRawValue().reorderLevel!,

        description: this.form.getRawValue().description!,

        isActive: this.form.getRawValue().isActive!

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

      const model: CreateProduct = {

        productCode: this.form.value.productCode!,

        productName: this.form.value.productName!,

        categoryId: this.form.value.categoryId!,

        supplierId: this.form.value.supplierId!,

        unitPrice: this.form.value.unitPrice!,

        stockQuantity: this.form.value.stockQuantity!,

        reorderLevel: this.form.value.reorderLevel!,

        description: this.form.value.description!

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

              categoryId: 0,

              supplierId: 0,

              unitPrice: 0,

              stockQuantity: 0,

              reorderLevel: 0,

              isActive: true

            });

          }

        });

    }

  }

}