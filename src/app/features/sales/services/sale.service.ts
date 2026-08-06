import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.prod';

import { Sale } from '../models/sale';
import { CreateSale } from '../models/create-sale';
import { UpdateSale } from '../models/update-sale';

import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Sale`;

  getAll(
    search: string = '',
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<Sale>> {

    return this.http.get<PagedResponse<Sale>>(this.apiUrl, {
      params: {
        search,
        pageNumber,
        pageSize
      }
    });

  }

  getById(id: number): Observable<Sale> {

    return this.http.get<Sale>(`${this.apiUrl}/${id}`);

  }

  create(model: CreateSale): Observable<string> {

    return this.http.post(
      this.apiUrl,
      model,
      {
        responseType: 'text'
      });

  }

  update(id: number, model: UpdateSale): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      model,
      {
        responseType: 'text'
      });

  }

  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      });

  }

}