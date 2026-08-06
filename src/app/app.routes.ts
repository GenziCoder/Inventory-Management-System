import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { CategoryPage } from './features/categories/pages/category-page/category-page';
import { CustomerComponent } from './features/customers/pages/customer/customer';
import { SupplierComponent } from './features/suppliers/pages/supplier/supplier';
import { ProductComponent } from './features/products/pages/product/product';
import { PurchaseComponent } from './features/purchases/pages/purchase/purchase';
import { SaleComponent } from './features/sales/pages/sale/sale';
export const routes: Routes = [

   

    {
        path:'login',
        component:Login
    },
    
        {
            path: '',
            component: MainLayout,
            canActivate: [authGuard],
            children: [
                {
                    path: 'dashboard',
                    component: Dashboard
                },
                {
                    path: 'categories',
                    component: CategoryPage
                },
                {
                    path: 'customers',
                    component: CustomerComponent
                 },
                 {
                    path: 'suppliers',
                    component: SupplierComponent
                 },
                 {
                     path: 'products',
                     component: ProductComponent
                  },
                 {
                    path: 'purchases',
                    component: PurchaseComponent 
                 },
                 {
                    path: 'sales',
                    component: SaleComponent,
                 },
                //  {
                //     path: 'reports',
                //     component: Report,
                //  }
                 
            ]
        },
    
    {
        path: '**',
        redirectTo: 'login'
    }
   

];