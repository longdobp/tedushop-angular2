import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { ModalDirective } from 'ngx-bootstrap';
import { MessageContstants } from '../../core/common/message.constant';
import swal from 'sweetalert';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filter: string = '';
  public entity: any;

  public announcements: any[];

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.dataService.get('/api/Announcement/getall?pageIndex=' + this.pageIndex
      + '&pageSize=' + this.pageSize)
      .subscribe((res: any) => {
        console.log(res);
        this.announcements = res.Items;
        this.pageIndex = res.PageIndex;
      }, error => this.dataService.handleError(error));
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  public showAdd() {
    this.entity = {};
    this.addEditModal.show();
  }

  public saveChanges(valid: boolean) {
    if (valid) {
      this.dataService.post('/api/Announcement/add', JSON.stringify(this.entity))
        .subscribe((res: any) => {
          console.log(res);
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this.dataService.handleError(error));
    }
  }

  public deleteItem(id: string) {
    swal(MessageContstants.CONFIRM_DELETE_MSG, {
      buttons: ["No", "Yes"]
    })
      .then((result) => {
        if (result) {
          this.dataService.delete('/api/Announcement/delete', 'id', id)
            .subscribe((res: any) => {
              this.search();
              this.notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
            }, error => this.dataService.handleError(error));
        } else {
          this.notificationService.printErrorMessage(MessageContstants.DELETED_CANCEL_MSG);
        }
      });
  }
}
