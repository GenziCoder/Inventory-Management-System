import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.prod';

import { Purchase } from '../models/purchase';

import { CreatePurchase } from '../models/create-purchase';

import { UpdatePurchase } from '../models/update-purchase';

import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Purchase`;

  getAll(
    search: string = '',
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<Purchase>> {

    return this.httpClient.get<PagedResponse<Purchase>>(
      this.apiUrl,
      {
        params: {
          search,
          pageNumber,
          pageSize
        }
      }
    );

  }

  getById(id: number): Observable<Purchase> {

    return this.httpClient.get<Purchase>(
      `${this.apiUrl}/${id}`
    );

  }

  create(model: CreatePurchase): Observable<string> {

    return this.httpClient.post(
      this.apiUrl,
      model,
      {
        responseType: 'text'
      }
    );

  }

  update(id: number, model: UpdatePurchase): Observable<string> {

    return this.httpClient.put(
      `${this.apiUrl}/${id}`,
      model,
      {
        responseType: 'text'
      }
    );

  }

  delete(id: number): Observable<string> {

    return this.httpClient.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}