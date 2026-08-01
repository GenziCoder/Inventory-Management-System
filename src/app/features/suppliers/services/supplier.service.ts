import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Supplier } from '../models/supplier';
import { CreateSupplier } from '../models/CreateSupplier';
import { UpdateSupplier } from '../models/UpdateSupplier';

import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Supplier`;

  getAll(
    search = '',
    pageNumber = 1,
    pageSize = 10
  ): Observable<PagedResponse<Supplier>> {

    return this.http.get<PagedResponse<Supplier>>(
      `${this.apiUrl}?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

  }

  getById(id: number): Observable<Supplier> {

    return this.http.get<Supplier>(
      `${this.apiUrl}/${id}`
    );

  }

  create(model: CreateSupplier): Observable<string> {

    return this.http.post(
      this.apiUrl,
      model,
      {
        responseType: 'text'
      });

  }

  update(
    id: number,
    model: UpdateSupplier
  ): Observable<string> {

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