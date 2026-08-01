// import {inject, Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';    
// import {environment} from '../../../../environments/environment'; 
// import {Observable} from 'rxjs';
// import {Product} from '../models/product';
// import {CreateProduct} from '../models/create-product';
// import {UpdateProduct} from '../models/update-product';
// import {PagedResponse} from '../../../shared/models/paged-response';  

// @Injectable({
//   providedIn: 'root'
// })

// export class ProductService{

//     private httpClient= inject(HttpClient);
//     private apiUrl=`${environment.apiUrl}/v1/Product`;

//     getAll(search: string = '',
//     pageNumber: number = 1,
//     pageSize: number = 10):Observable<PagedResponse<Product>>{

//        return this.httpClient.get<PagedResponse<Product>>(this.apiUrl,
//             {
//                  params:{
//                     search,
//                     pageNumber,
//                     pageSize
//                  }
//             });
//     }
      

//     getById(id:number):Observable<Product>{
//         return this.httpClient.get<Product>(
//             `${this.apiUrl}/${id}`
//         );
//     }

//     create(model:CreateProduct):Observable<string>{
//            return this.httpClient.post<string>(
//             `${this.apiUrl}`,
//             model,
//             {
//                 responseType: 'text' as 'json'
//             });
//     }

//     update(id: number, model: UpdateProduct): Observable<void> {
//         return this.httpClient.put<void>(
//             `${this.apiUrl}/${id}`,
//             model,
//             {
//                 responseType: 'text' as 'json'
//             }
            
//         );
//     }

//     delete(id: number): Observable<void> {
//         return this.httpClient.delete<void>(
//             `${this.apiUrl}/${id}`,
//             {
//                 responseType: 'text' as 'json'
//             }

//         );
//     }
// }

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Product } from '../models/product';
import { CreateProduct } from '../models/create-product';
import { UpdateProduct } from '../models/update-product';

import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/Product`;

  getAll(
    search: string = '',
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<Product>> {

    return this.httpClient.get<PagedResponse<Product>>(this.apiUrl, {
      params: {
        search,
        pageNumber,
        pageSize
      }
    });

  }

  getById(id: number): Observable<Product> {

    return this.httpClient.get<Product>(
      `${this.apiUrl}/${id}`
    );

  }

  create(model: CreateProduct): Observable<string> {

    return this.httpClient.post(
      this.apiUrl,
      model,
      {
        responseType: 'text'
      }
    );

  }

  update(id: number, model: UpdateProduct): Observable<string> {

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