import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

 import { Customer } from '../../models/customer';

import { CustomerList } from '../../components/customer-list/customer-list';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    CustomerList,
    CustomerForm,
    ModalComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class CustomerComponent {

  refresh = signal(false);
  deleting = signal(false);
  selectedCustomer: Customer | null = null;
  showCustomerModal = false;
  showDeleteDialog = false;
  customerToDelete: Customer | null = null;
private customerService = inject(CustomerService);
private toastr = inject(ToastrService);


  addCustomer() {

    // this.selectedCustomer = null;
    //  this.modal?.show();
     this.selectedCustomer = null;

    this.showCustomerModal = true;

  }

  editCustomer(customer: Customer) {

    this.selectedCustomer = customer;
    this.showCustomerModal = true;

  }

  deleteCustomer(customer: Customer) {

     this.customerToDelete = customer;

    this.showDeleteDialog = true;
  }

  onCustomerSaved() {

    this.refresh.update((value) => !value);
    this.showCustomerModal = false;
  }

  confirmDelete() {
    if (!this.customerToDelete) {
      return;
    }
      this.deleting.set(true);
      this.customerService.delete(this.customerToDelete.id)
      .pipe(
      finalize(() => this.deleting.set(false))
    )
      .subscribe({

      next:message=>{
               this.toastr.success(message);

              this.showDeleteDialog = false;

              this.customerToDelete = null;

              //this.refresh.set(!this.refresh());
              this.refresh.update((value) => !value);
      },
      error:error=>{
    console.error(error);
      }

    });
   
  }
}