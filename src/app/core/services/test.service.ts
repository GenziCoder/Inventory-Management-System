import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TestService extends BaseService {

  getProducts() {

    return this.http.get(`${this.apiUrl}/Product`);

  }

}