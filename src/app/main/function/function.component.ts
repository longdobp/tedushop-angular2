import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from '../../core/services/utility.service';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ModalDirective } from 'ngx-bootstrap';
import { MessageContstants } from '../../core/common/message.constant';
import swal from 'sweetalert';
import { AuthenService } from 'app/core/services/authen.service';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {

  @ViewChild('addEditModal') addEditModal: ModalDirective;
  @ViewChild('permissionModal') public permissionModal: ModalDirective;
  public _functionHierachy: any[];
  public _functions: any[];
  public filter: string = '';
  public editFlag: boolean;
  public entity: any;
  public functionId: string;
  public _permission: any[];

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    public _authenService: AuthenService
  ) { 
    if (_authenService.checkAccess('FUNCTION') == false) {
      utilityService.navigate('/');
    }
  }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.dataService.get('/api/function/getall?filter=' + this.filter
    ).subscribe((res: any[]) => {
      // console.log(res);
      this._functions = res.filter(x => x.ParentId == null);
      this._functionHierachy = this.utilityService.Unflatten(res);
      // console.log(this._functionHierachy);
    }, error => this.dataService.handleError(error));
  }

  public showPermission(id: any) {
    this.dataService.get('/api/appRole/getAllPermission?functionId=' + id)
      .subscribe((res: any[]) => {
        console.log(res);
        this.functionId = id;
        this._permission = res;
        this.permissionModal.show();
      }, error => this.dataService.handleError(error));
  }

  public savePermission(valid: boolean, _permission: any[]) {
    if (valid) {
      var data = {
        Permissions: this._permission,
        FunctionId: this.functionId
      }
      console.log(data);
      this.dataService.post('/api/appRole/savePermission', JSON.stringify(data))
        .subscribe((res: any) => {
          this.notificationService.printSuccessMessage(res);
          this.permissionModal.hide();
        }, error => this.dataService.handleError(error));
    }
  }

  public showAddModal() {
    this.entity = {};
    this.addEditModal.show();
    this.editFlag = false;
  }

  public showEdit(id: string) {
    this.dataService.get('/api/function/detail/' + id)
      .subscribe((res: any) => {
        // console.log(res);
        this.entity = res;
        this.editFlag = true;
        this.addEditModal.show();
      }, error => this.dataService.handleError(error));
  }

  public saveChanges(valid: boolean) {
    if (valid) {
      if (this.editFlag == false) {
        this.dataService.post('/api/function/add', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.search();
            this.addEditModal.hide();
            this.notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
          }, error => this.dataService.handleError(error));
      } else {
        this.dataService.put('/api/function/update', JSON.stringify(this.entity))
          .subscribe((res: any) => {
            this.search();
            this.addEditModal.hide();
            this.notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
          }, error => this.dataService.handleError(error));
      }
    }
  }

  public delete(id: any) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"],
    })
      .then((result) => {
        if (result) {
          this.dataService.delete('/api/function/delete', 'id', id)
            .subscribe((response: any) => {
              this.notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
              this.search();
            }, error => this.dataService.handleError(error));
        } else {
          this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }
}
