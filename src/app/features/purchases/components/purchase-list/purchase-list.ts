import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { finalize } from 'rxjs';

import { Purchase } from '../../models/purchase';
import { PurchaseService } from '../../services/purchase.service';

import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Pagination
  ],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.css'
})
export class PurchaseList implements OnChanges {

  private purchaseService = inject(PurchaseService);

  loading = signal(false);

  purchases = signal<Purchase[]>([]);

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalPages = 1;

  totalRecords = 0;

  @Input()
  refresh = false;

  @Output()
  edit = new EventEmitter<Purchase>();

  @Output()
  delete = new EventEmitter<Purchase>();

  constructor() {

    this.loadPurchases();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['refresh']) {

      this.loadPurchases();

    }

  }

  loadPurchases(): void {

    this.loading.set(true);

    this.purchaseService
      .getAll(
        this.search,
        this.pageNumber,
        this.pageSize
      )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({

        next: response => {

          this.purchases.set(response.data);

          this.totalPages = response.totalPages;

          this.totalRecords = response.totalRecords;

        }

      });

  }

  onSearch(): void {

    this.pageNumber = 1;

    this.loadPurchases();

  }

  previousPage(): void {

    if (this.pageNumber === 1) {

      return;

    }

    this.pageNumber--;

    this.loadPurchases();

  }

  nextPage(): void {

    if (this.pageNumber === this.totalPages) {

      return;

    }

    this.pageNumber++;

    this.loadPurchases();

  }

}