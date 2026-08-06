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

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Loading } from '../../../../shared/components/loading/loading';

import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBox,
    Pagination,
    Loading
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnChanges {

  private productService = inject(ProductService);

  loading = inject(LoadingService);

  products = signal<Product[]>([]);

  searchText = '';

  pageNumber = 1;

  pageSize = 10;

  totalPages = 0;

  totalRecords = 0;

  @Input()
  refresh = false;

  @Output()
  edit = new EventEmitter<Product>();

  @Output()
  delete = new EventEmitter<Product>();

  ngOnInit(): void {

    this.loadProducts();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['refresh']) {

      this.loadProducts();

    }

  }

  loadProducts() {

    this.loading.show();

    this.productService
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

          console.log('Response:', response);

          this.products.set(response.data);
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;

          console.log('Products signal:', this.products());

        },

        error: error => {

          console.error(error);

        }

      });

  }

  search() {

    this.pageNumber = 1;

    this.loadProducts();

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadProducts();

    }

  }

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadProducts();

    }

  }

}