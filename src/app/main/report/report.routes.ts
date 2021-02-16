import { Routes, RouterModule } from '@angular/router';
import { RevenueComponent } from './revenue/revenue.component';
import { VisitorComponent } from './visitor/visitor.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: VisitorComponent },
    { path: 'visitor', component: VisitorComponent },
    { path: 'revenues', component: RevenueComponent }
];
export const ReportRouter = RouterModule.forChild(routes);