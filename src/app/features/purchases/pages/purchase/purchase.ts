import { Component, inject, signal,computed } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Purchase } from '../../models/purchase';

import { PurchaseList } from '../../components/purchase-list/purchase-list';
import { PurchaseForm } from '../../components/purchase-form/purchase-form';

import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { PurchaseService } from '../../services/purchase.service';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    CommonModule,
    PurchaseForm,
    ModalComponent
  ],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css'
})
export class PurchaseComponent {

   private purchaseService = inject(PurchaseService);

   private toastr = inject(ToastrService);

readonly purchases = signal<Purchase[]>([]);
readonly search = signal('');

readonly pageNumber = signal(1);

readonly pageSize = signal(10);

readonly totalRecords = signal(0);
readonly loading = signal(false);

readonly selectedPurchase = signal<Purchase | null>(null);

readonly showModal = signal(false);


  loadPurchases(): void {

  this.loading.set(true);

  this.purchaseService
      .getAll(
          this.search(),
          this.pageNumber(),
          this.pageSize()
      )
      .pipe(
          finalize(() => this.loading.set(false))
      )
      .subscribe({

          next: response => {

              this.purchases.set(response.data);

              this.totalRecords.set(response.totalRecords);

          },

          error: error => {

              this.toastr.error(error.error);

          }

      });

}

  ngOnInit(): void {

    this.loadPurchases();

}

onSearch(value: string): void {

    this.search.set(value);

    this.pageNumber.set(1);

    this.loadPurchases();

}

onPageChange(page: number): void {

    this.pageNumber.set(page);

    this.loadPurchases();

}

addPurchase(): void {

    this.selectedPurchase.set(null);

    this.showModal.set(true);

}

editPurchase(purchase: Purchase): void {

    this.selectedPurchase.set(purchase);

    this.showModal.set(true);

}

closeModal(): void {

    this.showModal.set(false);

    this.selectedPurchase.set(null);

}

onSaved(): void {

    this.closeModal();

    this.loadPurchases();

}

deletePurchase(id: number): void {

    if (!confirm('Delete this purchase?')) {

        return;

    }

    this.purchaseService
        .delete(id)
        .subscribe({

            next: message => {

                this.toastr.success(message);

                this.loadPurchases();

            },

            error: error => {

                this.toastr.error(error.error);

            }

        });

}

readonly totalPages = computed<number>(() =>
    Math.ceil(
        this.totalRecords() / this.pageSize()
    )
);

}