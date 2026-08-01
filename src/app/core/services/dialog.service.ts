import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  confirm(title: string, text: string) {

    return Swal.fire({

      title,

      text,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#dc3545',

      cancelButtonColor: '#6c757d',

      confirmButtonText: 'Yes',

      cancelButtonText: 'Cancel'

    });

  }

}