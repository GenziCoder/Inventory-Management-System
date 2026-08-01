import { Component, inject,Output, EventEmitter, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnChanges {

@Input() category:any='';
@Output() saved = new EventEmitter<void>();
private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  private categoryService = inject(CategoryService);

  form = this.fb.group({

    name: ['', Validators.required],

    description: ['']

  });

  save() {

      if (this.form.invalid)
        return;

    if (this.category) {

    this.categoryService.update(

        this.category.id,

        this.form.getRawValue() as any

    ).subscribe({

        next: () => {

            this.notification.success("Category Updated Successfully");

            this.saved.emit();

        },
        error: error => {

              console.error(error);

            }

    });

}
else {

    this.categoryService.create(

        this.form.getRawValue() as any

    ).subscribe({

        next: () => {

            //alert("Category Created Successfully");
            this.notification.success("Category Created Successfully");

            this.saved.emit();

        },
        error: error => {

              console.error(error);

            }

    });

}

  }

  ngOnChanges(changes: SimpleChanges): void {

  if (this.category) {

    this.form.patchValue({

      name: this.category.name,

      description: this.category.description

    });

  }

}

}