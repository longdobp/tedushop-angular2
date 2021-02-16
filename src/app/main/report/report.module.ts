import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorComponent } from './visitor/visitor.component';
import { RevenueComponent } from './revenue/revenue.component';
import { ReportRouter } from './report.routes';

@NgModule({
  imports: [
    CommonModule,
    ReportRouter
  ],
  declarations: [VisitorComponent, RevenueComponent],
  providers: []
})
export class ReportModule { }
