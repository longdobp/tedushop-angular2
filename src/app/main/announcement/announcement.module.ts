import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from './announcement.component';
import { FormsModule } from '@angular/forms';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { AnnouncementRouter } from './announcement.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    AnnouncementRouter,
    ModalModule.forRoot()
  ],
  declarations: [AnnouncementComponent],
  providers: []
})
export class AnnouncementModule { }
