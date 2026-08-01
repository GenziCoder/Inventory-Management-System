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

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

import { FormsModule } from '@angular/forms';

import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Loading } from '../../../../shared/components/loading/loading';

import { LoadingService } from '../../../../core/services/loading.service';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBox,
    Pagination,
    Loading
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit, OnChanges {

  private customerService = inject(CustomerService);

  loading = inject(LoadingService);

  customers = signal<Customer[]>([]);

  searchText = '';

  pageNumber = 1;

  pageSize = 10;

  totalPages = 0;

  totalRecords = 0;

  @Input()
  refresh = false;

  @Output()
  edit = new EventEmitter<Customer>();

  @Output()
  delete = new EventEmitter<Customer>();

  ngOnInit(): void {

    this.loadCustomers();

  }

  ngOnChanges(changes: SimpleChanges): void {


    console.log(changes);
    if (changes['refresh']) {

      this.loadCustomers();

    }

  }

  loadCustomers() {

    this.loading.show();

    this.customerService
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

          this.customers.set(response.data);

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

    this.loadCustomers();

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadCustomers();

    }

  }

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadCustomers();

    }

  }

}