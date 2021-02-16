//@angular
import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageContstants } from 'app/core/common/message.constant';
import * as moment from "moment";

//3rd party apps
import { ModalDirective } from 'ngx-bootstrap';
import swal from 'sweetalert';

//local component
import { AuthenService } from '../../core/services/authen.service';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { UtilityService } from '../../core/services/utility.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterCustomerName: string = '';
  public filterStartDate: string = '';
  public filterPaymentStatus: string = '';
  public filterEndDate: string = '';
  public keyword: string = '';

  public orders: any[];
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  constructor(
    public authenService: AuthenService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.dataService.get('/api/Order/getlistpaging?startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate
      + '&customerName=' + this.filterCustomerName
      + '&paymentStatus=' + this.filterPaymentStatus
      + '&page=' + this.pageIndex
      + '&pageSize=' + this.pageSize
      + '&filter=' + this.keyword
    )
      .subscribe((res: any) => {
        // console.log(res);
        this.orders = res.Items;
        this.pageIndex = res.PageIndex;
      }, error => this.dataService.handleError(error));
  }

  public reset() {
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterCustomerName = '';
    this.filterPaymentStatus = '';
    this.search();
  }

  public changeStartDate(value: any) {
    this.filterStartDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }

  public changeEndDate(value: any) {
    this.filterEndDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  public deleteItem(id: string) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"]
    })
      .then((result) => {
        if (result) {
        } else {
          this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }
}
