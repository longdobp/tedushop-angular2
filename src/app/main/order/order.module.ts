//@angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//3rd party apps
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';

//local component
import { OrderComponent } from '../order/order.component';
import { OrderAddComponent } from '../order/order-add/order-add.component';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { OrderRouter } from './order.routes';



@NgModule({
    imports: [
        CommonModule,
        OrderRouter,
        FormsModule,
        PaginationModule,
        Daterangepicker,
        ModalModule
    ],
    declarations: [
        OrderComponent,
        OrderAddComponent,
        OrderDetailComponent
    ],
    providers: [
        DataService,
        NotificationService,
        UtilityService
    ]
})
export class OrderModule { }