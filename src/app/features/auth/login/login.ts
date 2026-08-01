
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
private router = inject(Router);
private tokenService = inject(TokenService);
  hidePassword = signal(true);

  loading = signal(false);

  loginForm = this.fb.group({

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]

  });

  login() {

    if (this.loginForm.invalid)
      return;

    this.loading.set(true);

    this.authService.login(this.loginForm.getRawValue() as any)
      .subscribe({

        next: response => {

          // console.log(response);

          // this.loading.set(false);
            this.loading.set(false);

            this.tokenService.setToken(response.data.token);

            this.router.navigate(['/dashboard']);

        },

        error: error => {

          console.error(error);

          this.loading.set(false);

        }

      });

  }

}