import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';

import { MessageContstants } from '../../core/common/message.constant';
import { SystemConstants } from '../../core/common/system.constant';
import { UploadService } from '../../core/services/upload.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  /*Declare modal */
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild("thumbnailImage") thumbnailImage;
  /*Product manage */
  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 5;
  public pageDisplay: number = 10;
  public filter: string = '';
  public filterCategoryID: number;
  public products: any[];
  public productCategories: any[];
  public CheckedItems: any[];

  constructor(
    public authenService: AuthenService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) {
    if (authenService.checkAccess('PRODUCT') == false) {
      utilityService.navigate('/');
    }
  }

  ngOnInit() {
    this.search();
    this.loadProductCategories();
  }

  public createAlias() {
    this.entity.Alias = this.utilityService.MakeSeoTitle(this.entity.Name);
  }

  public search() {
    this.dataService.get('/api/product/getall?categoryId=' + this.filterCategoryID
      + '&keyword=' + this.filter
      + '&page=' + this.pageIndex
      + '&pageSize=' + this.pageSize
    ).subscribe((res: any) => {
      console.log(res);
      this.products = res.Items;
      this.pageIndex = res.PageIndex;
      this.pageSize = res.PageSize;
      this.totalRow = res.TotalRows;
    }, error => this.dataService.handleError(error));
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  public reset() {
    this.filter = '';
    this.filterCategoryID = null;
    this.search();
  }

  public deleteMulti() {
    this.CheckedItems = this.products.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.CheckedItems.length; ++i)
      checkedIds.push(this.CheckedItems[i]["ID"]);

    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"]
    })
      .then((result) => {
        if (result) {
          this.dataService.delete('/api/product/deletemulti', 'checkedProducts', JSON.stringify(checkedIds))
            .subscribe((res: any) => {
              this.notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
              this.search();
            }, error => this.dataService.handleError(error));
        } else {
          this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }

  public showAdd() {
    this.entity = { Content: '' }
    this.addEditModal.show();
  }

  public showImageManage() {

  }

  public showQuantityManage() {

  }

  public showEdit(id: string) {
    this.dataService.get('/api/product/detail/' + id)
      .subscribe((res: any) => {
        this.entity = res;
        this.addEditModal.show();
      }, error => this.dataService.handleError(error));
  }

  private loadProductCategories() {
    this.dataService.get('/api/productCategory/getallhierachy')
      .subscribe((response: any[]) => {
        this.productCategories = response;
      }, error => this.dataService.handleError(error));
  }

  public saveChanges(valid: boolean) {
    if (valid) {
      let fi = this.thumbnailImage.nativeElement;
      if (fi.files.length > 0) {
        this.uploadService.postWithFile('/api/upload/saveImage?type=product', null, fi.files)
          .then((imageUrl: string) => {
            this.entity.ThumbnailImage = imageUrl;
          }).then(() => {
            this.saveData();
          });
      }
      else {
        this.saveData();
      }
    }
  }

  private saveData() {
    if (this.entity.ID == undefined) {
      this.dataService.post('/api/product/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        });
    }
    else {
      this.dataService.put('/api/product/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this.dataService.handleError(error));
    }
  }

  public deleteItem(id: any) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"],
    })
      .then((result) => {
        if (result) {
          this.dataService.delete('/api/product/delete', 'id', id)
            .subscribe((res: Response) => {
              this.notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
              this.search();
            }, error => this.dataService.handleError(error));
        } else {
          this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }

  public keyupHandlerContentFunction(e: any) {
    this.entity.Content = e;
  }
}
