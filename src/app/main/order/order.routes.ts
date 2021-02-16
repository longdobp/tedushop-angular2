import { Routes, RouterModule } from '@angular/router';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderComponent } from './order.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: OrderComponent },
    { path: 'add', component: OrderAddComponent },
    { path: 'detail/:id', component: OrderDetailComponent }
];
export const OrderRouter = RouterModule.forChild(routes);