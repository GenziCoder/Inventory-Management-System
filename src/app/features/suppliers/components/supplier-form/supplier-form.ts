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

import { finalize } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { Supplier } from '../../models/supplier';
import { CreateSupplier } from '../../models/CreateSupplier';
import { UpdateSupplier } from '../../models/UpdateSupplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnChanges {

  saving = signal(false);

  private fb = inject(FormBuilder);

  private supplierService = inject(SupplierService);

  private toastr = inject(ToastrService);

  @Input()
  supplier: Supplier | null = null;

  @Output()
  saved = new EventEmitter<void>();

  form = this.fb.group({

    supplierCode: ['', Validators.required],

    companyName: ['', Validators.required],

    contactPerson: ['', Validators.required],

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

    if (this.supplier) {

      this.form.patchValue(this.supplier);

      this.form.controls.supplierCode.disable();

    }
    else {

      this.form.reset({

        isActive: true

      });

      this.form.controls.supplierCode.enable();

    }

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.supplier) {

      const model: UpdateSupplier = {

        companyName: this.form.getRawValue().companyName!,

        contactPerson: this.form.getRawValue().contactPerson!,

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

      this.supplierService
        .update(this.supplier.id, model)
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

          error: error => console.error(error)

        });

    }
    else {

      const model: CreateSupplier = {

        supplierCode: this.form.value.supplierCode!,

        companyName: this.form.value.companyName!,

        contactPerson: this.form.value.contactPerson!,

        email: this.form.value.email!,

        phone: this.form.value.phone!,

        address: this.form.value.address!,

        city: this.form.value.city!,

        state: this.form.value.state!,

        country: this.form.value.country!,

        postalCode: this.form.value.postalCode!

      };

      this.saving.set(true);

      this.supplierService
        .create(model)
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

          error: error => console.error(error)

        });

    }

  }

}