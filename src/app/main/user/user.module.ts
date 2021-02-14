import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Daterangepicker } from 'ng2-daterangepicker';

import { UserComponent } from './user.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


const userRoutes: Routes = [
  //localhost:4200/main/user
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/user/index
  { path: 'index', component: UserComponent }
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule,
    // MultiselectDropdownModule,
    Daterangepicker,
    RouterModule.forChild(userRoutes),
  
  ],
  providers: [
    DataService,
    NotificationService,
    UploadService
  ],
  declarations: [UserComponent]
})
export class UserModule { }
