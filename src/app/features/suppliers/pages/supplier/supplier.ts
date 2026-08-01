import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Supplier } from '../../models/supplier';

import { SupplierList } from '../../components/supplier-list/supplier-list';
import { SupplierForm } from '../../components/supplier-form/supplier-form';

import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { SupplierService } from '../../services/supplier.service';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    CommonModule,
    SupplierList,
    SupplierForm,
    ModalComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class SupplierComponent {

  refresh = signal(false);

  deleting = signal(false);

  selectedSupplier: Supplier | null = null;

  showSupplierModal = false;

  showDeleteDialog = false;

  supplierToDelete: Supplier | null = null;

  private supplierService = inject(SupplierService);

  private toastr = inject(ToastrService);

  addSupplier() {

    this.selectedSupplier = null;

    this.showSupplierModal = true;

  }

  editSupplier(supplier: Supplier) {

    this.selectedSupplier = supplier;

    this.showSupplierModal = true;

  }

  deleteSupplier(supplier: Supplier) {

    this.supplierToDelete = supplier;

    this.showDeleteDialog = true;

  }

  onSupplierSaved() {

    this.showSupplierModal = false;

    this.refresh.update(value => !value);

  }
  

  confirmDelete() {

    if (!this.supplierToDelete) {

      return;

    }

    this.deleting.set(true);

    this.supplierService
      .delete(this.supplierToDelete.id)
      .pipe(
        finalize(() => this.deleting.set(false))
      )
      .subscribe({

        next: message => {

          this.toastr.success(message);

          this.showDeleteDialog = false;

          this.supplierToDelete = null;

          this.refresh.update(value => !value);

        },

        error: error => {

          console.error(error);

        }

      });

  }

}