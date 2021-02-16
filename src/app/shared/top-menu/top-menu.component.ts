import { Component, NgZone, OnInit } from '@angular/core';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { SystemConstants } from '../../core/common/system.constant';
import { UtilityService } from '../../core/services/utility.service';
import { UrlConstants } from '../../core/common/url.constant';
import { DataService } from '../../core/services/data.service';
import { SignalrService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API;
  public canSendMessage: Boolean;
  public announcements: any[];

  constructor(
    private dataService: DataService,
    private authenService: AuthenService,
    private utilityService: UtilityService,
    private signalRService: SignalrService,
    private ngZone: NgZone
  ) {
    // this can subscribe for events  
    this.subscribeToEvents();
    // this can check for conenction exist or not.  
    this.canSendMessage = signalRService.connectionExists;
  }

  ngOnInit() {
    this.user = this.authenService.getLoggedInUser();
    this.loadAnnouncements();
  }

  private subscribeToEvents(): void {
    var self = this;
    self.announcements = [];

    // if connection exists it can call of method.  
    this.signalRService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    });

    // finally our service method to call when response received from server event and transfer response to some variable to be shwon on the browser.  
    this.signalRService.announcementReceived.subscribe((announcement: any) => {
      this.ngZone.run(() => {
        announcement.CreatedDate = moment(announcement.CreatedDate).fromNow();
        self.announcements.push(announcement);
      });
    });
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }

  markAsRead(id: number) {
    var body = { announId: id };
    this.dataService.get('/api/Announcement/markAsRead?announId=' + id.toString())
      .subscribe((res: any) => {
        if (res) {
          this.loadAnnouncements();
        }
      });
  }

  private loadAnnouncements() {
    this.dataService.get('/api/Announcement/getTopMyAnnouncement')
      .subscribe((res: any) => {
        this.announcements = [];
        for (let item of res) {
          item.CreatedDate = moment(item.CreatedDate).fromNow();
          this.announcements.push(item);
        }
        console.log(this.announcements);
      });
  }
}
