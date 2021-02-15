import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { SystemConstants } from '../../core/common/system.constant';
import { UtilityService } from '../../core/services/utility.service';
import { UrlConstants } from '../../core/common/url.constant';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API; 
  
  constructor(
    private authenService: AuthenService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.user = this.authenService.getLoggedInUser();
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }
}
