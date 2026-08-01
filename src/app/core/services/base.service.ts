import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected http = inject(HttpClient);

  protected apiUrl = environment.apiUrl;

}