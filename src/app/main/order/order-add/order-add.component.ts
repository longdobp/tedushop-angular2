import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constant';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public entity: any = { Status: true, CustomerMessage: 'N/A' };
  public sizeId: number = null;
  public colorId: number = null;
  public colors: any[];
  public sizes: any[];
  public products: any[];
  public orderDetails: any[] = [];
  public detailEntity: any = {
    ProductID: 0,
    Quantity: 0,
    Price: 0
  };

  constructor(
    private utilityService: UtilityService,
    private dataService: DataService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  public goBack() {
    this.utilityService.navigate('/main/order/index');
  }

  public showAddDetail() {
    this.loadProducts();
    this.loadColors();
    this.loadSizes();
    this.addEditModal.show();
  }

  public loadProducts() {
    this.dataService.get('/api/product/getallparents')
      .subscribe((res: any) => {
        // console.log(res);
        this.products = res;
      }, error => this.dataService.handleError(error));
  }

  public loadColors() {
    this.dataService.get('/api/productQuantity/getcolors')
      .subscribe((res: any) => {
        // console.log(res);
        this.colors = res;
      }, error => this.dataService.handleError(error));
  }

  public loadSizes() {
    this.dataService.get('/api/productQuantity/getsizes')
      .subscribe((res: any) => {
        // console.log(res);
        this.sizes = res;
      }, error => this.dataService.handleError(error));
  }

  public saveChanges(valid: boolean) {
    if (valid) {
      this.entity.OrderDetails = this.orderDetails;
      this.dataService.post('/api/Order/add', JSON.stringify(this.entity))
        .subscribe((res: any) => {
          this.entity = res;
          this.notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this.dataService.handleError(error));
    }
  }

  public saveOrderDetail(valid: boolean) {
    if (valid) {
      this.addEditModal.hide();
      this.detailEntity.Product = this.products.find(x => x.ID == this.detailEntity.ProductID);
      this.orderDetails.push(this.detailEntity);
      this.detailEntity = {
        ProductID: 0,
        Quantity: 0,
        Price: 0
      };
    }
  }

  public deleteDetail(item: any) {
    for (var index = 0; index < this.orderDetails.length; index++) {
      let orderDetail = this.orderDetails[index];
      if (orderDetail.ProductID == item.ProductID
        && orderDetail.colorId == item.colorId
        && orderDetail.sizeId == item.sizeId) {
          this.orderDetails.splice(index, 1);
      }
    }
  }
}
