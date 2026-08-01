import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ApiResponse } from '../../../core/models/api-response';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);
  private tokenService = inject(TokenService);
  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/Auth/login`,
      request
    );

  }

  logout(): void {

  this.tokenService.removeToken();

  this.router.navigate(['/login']);
}

}