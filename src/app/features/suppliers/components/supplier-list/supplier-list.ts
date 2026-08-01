import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { finalize } from 'rxjs';

import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Loading } from '../../../../shared/components/loading/loading';

import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBox,
    Pagination,
    Loading
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList implements OnInit, OnChanges {

  private supplierService = inject(SupplierService);

  loading = inject(LoadingService);

  suppliers = signal<Supplier[]>([]);

  searchText = '';

  pageNumber = 1;

  pageSize = 10;

  totalPages = 0;

  totalRecords = 0;

  @Input()
  refresh = false;

  @Output()
  edit = new EventEmitter<Supplier>();

  @Output()
  delete = new EventEmitter<Supplier>();

  ngOnInit(): void {

    this.loadSuppliers();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['refresh']) {

      this.loadSuppliers();

    }

  }

  loadSuppliers() {

    this.loading.show();

    this.supplierService
      .getAll(
        this.searchText,
        this.pageNumber,
        this.pageSize
      )
      .pipe(
        finalize(() => this.loading.hide())
      )
      .subscribe({

        next: response => {

          this.suppliers.set(response.data);

          this.pageNumber = response.pageNumber;

          this.pageSize = response.pageSize;

          this.totalPages = response.totalPages;

          this.totalRecords = response.totalRecords;

        },

        error: error => {

          console.error(error);

        }

      });

  }

  search() {

    this.pageNumber = 1;

    this.loadSuppliers();

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadSuppliers();

    }

  }

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadSuppliers();

    }

  }

}