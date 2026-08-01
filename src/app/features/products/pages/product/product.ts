import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../models/product';
import { ProductList } from '../../components/product-list/product-list';
import { ProductForm } from '../../components/product-form/product-form';

import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ProductList,
    ProductForm,
    ModalComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent {

  private productService = inject(ProductService);

  private toastr = inject(ToastrService);

  refresh = signal(false);

  deleting = signal(false);

  selectedProduct: Product | null = null;

  productToDelete: Product | null = null;

  showProductModal = false;

  showDeleteDialog = false;

  addProduct() {

    this.selectedProduct = null;

    this.showProductModal = true;

  }

  editProduct(product: Product) {

    this.selectedProduct = product;

    this.showProductModal = true;

  }

  deleteProduct(product: Product) {

    this.productToDelete = product;

    this.showDeleteDialog = true;

  }

  onProductSaved() {

    this.refresh.update(value => !value);

    this.showProductModal = false;

  }

  confirmDelete() {

    if (!this.productToDelete) {

      return;

    }

    this.deleting.set(true);

    this.productService
      .delete(this.productToDelete.id)
      .pipe(
        finalize(() => this.deleting.set(false))
      )
      .subscribe({

        next: message => {

          this.toastr.success(message);

          this.showDeleteDialog = false;

          this.productToDelete = null;

          this.refresh.update(value => !value);

        },

        error: error => {

          console.error(error);

          this.toastr.error(error.error);

        }

      });

  }

}