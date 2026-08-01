import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Customer } from '../models/customer';
import { CreateCustomer } from '../models/create-customer';
import { UpdateCustomer } from '../models/update-customer';

import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Customer`;

  getAll(
    search: string = '',
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<Customer>> {

    return this.http.get<PagedResponse<Customer>>(
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

  getById(id: number): Observable<Customer> {

    return this.http.get<Customer>(
      `${this.apiUrl}/${id}`
    );

  }

  create(model: CreateCustomer): Observable<string> {

    return this.http.post(
      this.apiUrl,
      model,
      {
        responseType: 'text'
      }
    );

  }

  update(
    id: number,
    model: UpdateCustomer
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      model,
      {
        responseType: 'text'
      }
    );

  }

  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}