import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal 
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerForm implements OnChanges {

   saving = signal(false);
  private fb = inject(FormBuilder);

  private customerService = inject(CustomerService);

  private toastr = inject(ToastrService);

  @Input()
  customer: Customer | null = null;

  @Output()
  saved = new EventEmitter<void>();

  form = this.fb.group({

    customerCode: ['', Validators.required],

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: ['', Validators.email],

    phone: [''],

    address: [''],

    city: [''],

    state: [''],

    country: [''],

    postalCode: [''],

    isActive: [true]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (this.customer) {

      this.form.patchValue(this.customer);

      this.form.controls.customerCode.disable();

    }
    else {

      this.form.reset({

        isActive: true

      });

      this.form.controls.customerCode.enable();

    }

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.customer) {

      const model = {

        firstName: this.form.getRawValue().firstName!,

        lastName: this.form.getRawValue().lastName!,

        email: this.form.getRawValue().email!,

        phone: this.form.getRawValue().phone!,

        address: this.form.getRawValue().address!,

        city: this.form.getRawValue().city!,

        state: this.form.getRawValue().state!,

        country: this.form.getRawValue().country!,

        postalCode: this.form.getRawValue().postalCode!,

        isActive: this.form.getRawValue().isActive!

      };
       this.saving.set(true);
      this.customerService.update(this.customer.id, model)
        .pipe(
            finalize(() => this.saving.set(false))
          )
        .subscribe({

          next: message => {

            this.toastr.success(message);

            this.saved.emit();
            this.form.reset({
                isActive: true
            });
            
          },
          error: error => {

            console.error(error);   
          }

        });

    }
    else {

      const model = {

        customerCode: this.form.value.customerCode!,

        firstName: this.form.value.firstName!,

        lastName: this.form.value.lastName!,

        email: this.form.value.email!,

        phone: this.form.value.phone!,

        address: this.form.value.address!,

        city: this.form.value.city!,

        state: this.form.value.state!,

        country: this.form.value.country!,

        postalCode: this.form.value.postalCode!

      };
        this.saving.set(true);
      this.customerService.create(model)
         .pipe(
            finalize(() => this.saving.set(false))
          )
        .subscribe({

          next: message => {

            this.toastr.success(message);

            

            this.form.reset({

              isActive: true

            });
            this.saved.emit();
          },
           error: error => {

            console.error(error);   
          }

        });

    }

  }
  

}