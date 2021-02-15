import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constant';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeComponent } from 'angular-tree-component';
import { AuthenService } from '../../core/services/authen.service';
import { UploadService } from '../../core/services/upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  // @ViewChild('image') image;
  @ViewChild(TreeComponent)
  private treeProductCategory: TreeComponent;
  public filter: string = '';
  public entity: any;
  public functionId: string;
  public _productCategoryHierachy: any[];
  public _productCategories: any[];
  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    public authenService: AuthenService,
    private uploadService: UploadService
  ) {
    if (authenService.checkAccess('PRODUCT_CATEGORY') == false) {
      utilityService.navigate('/')
    }
  }

  ngOnInit() {
    this.search();
    this.getListForDropdown();
  }

  public createAlias() {
    this.entity.Alias = this.utilityService.MakeSeoTitle(this.entity.Name);
    // console.log(this.entity.Alias);
  }

  public search() {
    this.dataService.get('/api/productCategory/getall?filter=' + this.filter)
      .subscribe((res: any[]) => {
        this._productCategoryHierachy = this.utilityService.Unflatten2(res);
        this._productCategories = res;
        // console.log(res);
      }, error => this.dataService.handleError(error));
  }

  public getListForDropdown() {
    this.dataService.get('/api/productCategory/getallhierachy')
      .subscribe((response: any[]) => {
        this._productCategories = response;
      }, error => this.dataService.handleError(error));
  }

  public showAdd() {
    this.entity = {};
    this.addEditModal.show();
  }

  public showEdit(id: string) {
    this.dataService.get('/api/productCategory/detail/' + id)
      .subscribe((res: any) => {
        // console.log(res);
        this.entity = res;
        this.addEditModal.show();
      }, error => this.dataService.handleError(error));
  }

  public deleteItem(id: any) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"],
    }).then((result) => {
      if (result) {
        this.dataService.delete('/api/productCategory/delete', 'id', id)
          .subscribe((res: Response) => {
            this.notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
            this.search();
          }, error => this.dataService.handleError(error));
      } else {
        this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
      }
    });
  }

  public saveChanges(valid: boolean) {
    if (valid) {
      if (this.entity.ID == undefined) {
        this.dataService.post('/api/productCategory/add', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.search();
            this.addEditModal.hide();
            this.notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
          }, error => this.dataService.handleError(error));
      } else {
        this.dataService.put('/api/productCategory/update', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.search();
            this.addEditModal.hide();
            this.notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
          }, error => this.dataService.handleError(error));
      }
    }
  }
}
