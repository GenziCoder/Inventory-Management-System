import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';

import { Input, OnChanges, SimpleChanges,Output, EventEmitter  } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { Loading } from '../../../../shared/components/loading/loading';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule,Loading,Pagination,SearchBox],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit, OnChanges {
  searchText:string = '';
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);

  @Input() refresh = false;
  @Output() edit = new EventEmitter<Category>();
  @Output() delete = new EventEmitter<Category>();
 loading = inject(LoadingService);

    pageNumber = 1;

    pageSize = 10;

    totalPages = 0;

    totalRecords = 0;


  ngOnInit(): void {

    this.loadCategories();

  }

  loadCategories() {

    this.loading.show();

    this.categoryService.getAll(
      this.searchText,
      this.pageNumber,
      this.pageSize
    )
     .pipe(
    finalize(() => this.loading.hide())
    )
      .subscribe({

        next: response => {

          this.categories.set(response.data);
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
          //this.loading.hide();

        },

        error: error => {

          //this.loading.hide();
          console.error(error);
        }

      });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['refresh']){

        this.loadCategories();

    }
  }
  search(){

   this.pageNumber = 1;
    this.loadCategories();

}

previousPage() {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadCategories();

  }

}

nextPage() {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadCategories();

  }

}

}