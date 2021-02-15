import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { SystemConstants } from '../../core/common/system.constant';
import { UtilityService } from '../../core/services/utility.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API;

  constructor(
    private authenService: AuthenService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.user = this.authenService.getLoggedInUser();
  }

}
