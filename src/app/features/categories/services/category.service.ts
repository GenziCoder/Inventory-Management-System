import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ApiResponse } from '../../../core/models/api-response';
import { Category } from '../models/category';
import { CategoryRequest } from '../models/category-request';
import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

//  getAll(search: string = ''): Observable<ApiResponse<Category[]>> {

//   return this.http.get<ApiResponse<Category[]>>(
//     `${this.apiUrl}/Category?search=${search}`
//   );
  getAll(search: string = '',pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponse<Category>> {

    return this.http.get<PagedResponse<Category>>(
      //`${this.apiUrl}/Category?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      `${this.apiUrl}/Category`,
      {
        params: {
          search,//: search,
          pageNumber,//: pageNumber.toString(),
          pageSize//: pageSize.toString()
        }
      }
    );

}

  getById(id: number): Observable<ApiResponse<Category>> {

    return this.http.get<ApiResponse<Category>>(
      `${this.apiUrl}/Category/${id}`
    );

  }

  create(request: CategoryRequest): Observable<ApiResponse<Category>> {

    return this.http.post<ApiResponse<Category>>(
      `${this.apiUrl}/Category`,
      request
    );

  }

  update(id: number, request: CategoryRequest): Observable<ApiResponse<Category>> {

    return this.http.put<ApiResponse<Category>>(
      `${this.apiUrl}/Category/${id}`,
      request
    );

  }

  delete(id: number): Observable<ApiResponse<boolean>> {

    return this.http.delete<ApiResponse<boolean>>(
      `${this.apiUrl}/Category/${id}`
    );

  }

}