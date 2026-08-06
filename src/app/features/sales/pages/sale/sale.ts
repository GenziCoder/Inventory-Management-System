import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Sale } from '../../models/sale';
import { SaleService } from '../../services/sale.service';

import { SaleList } from '../../components/sale-list/sale-list';
import { SaleForm } from '../../components/sale-form/sale-form';

import { ModalComponent } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    CommonModule,
    SaleList,
    SaleForm,
    ModalComponent
  ],
  templateUrl: './sale.html',
  styleUrl: './sale.css'
})
export class SaleComponent implements OnInit {

  private readonly saleService = inject(SaleService);

  private readonly toastr = inject(ToastrService);

  readonly sales = signal<Sale[]>([]);

  readonly loading = signal(false);

  readonly showModal = signal(false);

  readonly selectedSale = signal<Sale | null>(null);

  readonly search = signal('');

  readonly pageNumber = signal(1);

  readonly pageSize = signal(10);

  readonly totalRecords = signal(0);

  readonly totalPages = computed(() =>
    Math.ceil(this.totalRecords() / this.pageSize())
  );

  ngOnInit(): void {

    this.loadSales();

  }

  loadSales(): void {

    this.loading.set(true);

    this.saleService
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

          this.sales.set(response.data);

          this.totalRecords.set(response.totalRecords);

        },

        error: error => {

          this.toastr.error(error.error);

        }

      });

  }

  onSearch(value: string): void {

    this.search.set(value);

    this.pageNumber.set(1);

    this.loadSales();

  }

  onPageChange(page: number): void {

    this.pageNumber.set(page);

    this.loadSales();

  }

  addSale(): void {

  console.log('Add Sale Clicked');

  this.selectedSale.set(null);

  this.showModal.set(true);

  console.log(this.showModal());

  }

  editSale(sale: Sale): void {

    this.selectedSale.set(sale);

    this.showModal.set(true);

  }

  closeModal(): void {

    this.showModal.set(false);

    this.selectedSale.set(null);

  }

  onSaved(): void {

    this.closeModal();

    this.loadSales();

  }

  deleteSale(id: number): void {

    if (!confirm('Delete this sale?')) {

      return;

    }

    this.saleService
      .delete(id)
      .subscribe({

        next: message => {

          this.toastr.success(message);

          this.loadSales();

        },

        error: error => {

          this.toastr.error(error.error);

        }

      });

  }

}