import { Component, signal,inject } from '@angular/core';
import { CategoryList } from '../../components/category-list/category-list';
import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryService } from '../../services/category.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CategoryList,
    CategoryForm
  ],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css'
})
export class CategoryPage {

  showForm = signal(false);
  refreshList = signal(false);
  selectedCategory: any = null;
  private categoryService = inject(CategoryService);
  private dialog = inject(DialogService);
  private notification = inject(NotificationService);
  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onCategorySaved(){
    this.selectedCategory = null;
    this.showForm.set(false);
    this.refreshList.set(!this.refreshList());
  }

  editCategory(category: any){

    this.selectedCategory = category;

    this.showForm.set(true);
}

async deleteCategory(category: any) {

  // if (!confirm(`Delete "${category.name}"?`)) {

  //   return;

  // }
      const result = await this.dialog.confirm(
      'Delete Category',
      `Delete "${category.name}"?`
    );
    if(!result.isConfirmed){
    return;
    }

  this.categoryService.delete(category.id)

    .subscribe({

      next: () => {

        //alert("Category Deleted Successfully");
        this.notification.success("Category Deleted Successfully");

        this.refreshList.set(!this.refreshList());

      },

      error: error => {

        console.error(error);

      }

    });

}


}