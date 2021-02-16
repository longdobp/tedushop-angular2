import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constant';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderDetails: any[];
  public entity: any;
  public totalAmount: number;

  constructor(
    private utilityService: UtilityService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let orderId = params['id'];
      this.loadOrder(orderId);
      this.loadOrderDetail(orderId);
    })

  }

  public goBack() {
    this.utilityService.navigate('/main/order/index');
  }

  public loadOrder(id: number) {
    this.dataService.get('/api/Order/detail/' + id)
      .subscribe((res: any) => {
        // console.log(res);
        this.entity = res;
      }, error => this.dataService.handleError(error));
  }

  public loadOrderDetail(id: number) {
    this.dataService.get('/api/Order/getalldetails/' + id)
      .subscribe((res: any) => {
        this.orderDetails = res;
        this.totalAmount = 0;
        for (var item of res) {
          this.totalAmount += item.Quantity * item.Price;
        }
        // console.log(this.totalAmount);
      }, error => this.dataService.handleError(error));
  }

  public saveChanges() {

  }

  public exportToExcel() {

  }
}
