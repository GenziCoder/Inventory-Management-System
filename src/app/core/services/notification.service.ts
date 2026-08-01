import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastr = inject(ToastrService);

  success(message: string) {

    this.toastr.success(message);

  }

  error(message: string) {

    this.toastr.error(message);

  }

  warning(message: string) {

    this.toastr.warning(message);

  }

  info(message: string) {

    this.toastr.info(message);

  }

}