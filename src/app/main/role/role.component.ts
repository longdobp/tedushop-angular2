import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from 'app/core/services/notification.service';
import { MessageContstants } from 'app/core/common/message.constant';
import swal from 'sweetalert';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { NgForm } from '@angular/forms';

declare var alertify: any;

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})

export class RoleComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 25;
  public pageDisplay: number = 10;
  public filter: string = '';
  public roles: any = [];
  public entity: any;

  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService
  ) {
    if (_authenService.checkAccess('ROLE') == false) {
      _utilityService.navigate('/');
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/appRole/getlistpaging?page=' + this.pageIndex
      + '&pageSize=' + this.pageSize
      + '&filter=' + this.filter)
      .subscribe((res: any) => {
        this.roles = res.Items;
        this.totalRow = res.TotalRows;
        this.pageIndex = res.PageIndex;
        this.pageSize = res.PageSize;
      });
  }

  loadRole(id: any) {
    this._dataService.get('/api/appRole/detail/' + id)
      .subscribe((res: any) => {
        this.entity = res;
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }

  showEditModal(id: any) {
    this.loadRole(id);
    this.modalAddEdit.show()
  }

  saveChange(form: NgForm) {
    if (form.valid) {
      if (this.entity.Id == undefined) {
        this._dataService.post('/api/appRole/add', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.loadData();
            this.modalAddEdit.hide();
            form.resetForm();
            this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      }
      else {
        this._dataService.put('/api/appRole/update', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.loadData();
            this.modalAddEdit.hide();
            form.resetForm();
            this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      }
    }
  }

  deleteItem(id: any) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"],
    })
      .then((result) => {
        if (result) {
          this._dataService.delete('/api/appRole/delete', 'id', id)
            .subscribe((res: Response) => {
              this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
              this.loadData();
            }, error => this._dataService.handleError(error));
        } else {
          this._notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }
}
