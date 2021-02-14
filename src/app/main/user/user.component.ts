import { Component, OnInit, ViewChild } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { NotificationService } from '../../core/services/notification.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { MessageContstants } from '../../core/common/message.constant';
// declare var moment : any;
import * as moment from 'moment';
import swal from 'sweetalert';
import { UploadService } from '../../core/services/upload.service';
import { SystemConstants } from '../../core/common/system.constant';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  @ViewChild('avatar') avatar;
  
  public pageIndex: number = 1;
  public pageSize: number = 25;
  public filter: string = '';
  public users: any = [];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;

  public allRoles: IMultiSelectOption[] = [];
  public myRoles: string[] = [];
  public roles: any[];

  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  public selectGender(event) {
    this.entity.Gender = event.target.value
  }
  public selectedDate(value: any) {
    this.entity.BirthDay = moment(value.end._d).format('DD/MM/YYYY');
  }

  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _uploadService: UploadService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService
  ) { 
    if (_authenService.checkAccess('USER') == false) {
      _utilityService.navigateToLogin();
    }
  }

  ngOnInit() {
    this.loadData();
    this.loadRole();
  }

  loadData() {
    this._dataService.get('/api/appUser/getlistpaging?page=' + this.pageIndex
      + '&pageSize=' + this.pageSize
      + '&filter=' + this.filter
    ).subscribe((res: any) => {
      // console.log(res);
      this.users = res.Items;
      // console.log(this.users);
    });
  }

  loadRole() {
    this._dataService.get('/api/appRole/getlistall')
      .subscribe((res: any[]) => {
        //console.log(res);
        this.allRoles = [];
        for (let role of res) {
          this.allRoles.push({
            id: role.Name,
            name: role.Description
          });
        }
      }, error => this._dataService.handleError(error));
  }

  loadUserDetail(id: any) {
    this._dataService.get('/api/appUser/detail/' + id)
      .subscribe((res: any) => {
        this.entity = res;
        this.myRoles = [];
        for (let role of this.entity.Roles) {
          this.myRoles.push(role);
        }
        console.log(res);
        this.entity.BirthDay = moment(new Date(this.entity.BirthDay)).format('DD/MM/YYYY');
      })
  }

  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }

  showEditModal(id: any) {
    this.loadUserDetail(id);
    this.modalAddEdit.show();
  }

  saveChange(valid: boolean) {
    if (valid) {
      this.entity.Roles = this.myRoles;
      let fi = this.avatar.nativeElement;
      if (fi.files.length > 0) {
        this._uploadService.postWithFile('/api/upload/saveImage', null, fi.files)
          .then((imageUrl: string) => {

            this.entity.Avatar = imageUrl;
          }).then(() => {
            this.saveData();
          });
      } else {
        this.saveData();
      }
    }
  }

  private saveData() {
    if (this.entity.Id == undefined) {
      console.log(this.entity);
      this._dataService.post('/api/appUser/add', JSON.stringify(this.entity))
        .subscribe((res: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    } else {
      console.log(JSON.stringify(this.entity));
      this._dataService.put('/api/appUser/update', JSON.stringify(this.entity))
        .subscribe((res: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }

  deleteItem(id: any) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"],
    })
      .then((result) => {
        if (result) {
          this._dataService.delete('/api/appUser/delete', 'id', id).subscribe((res: Response) => {
            this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
            this.loadData();
          });
        } else {
          this._notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }
}
