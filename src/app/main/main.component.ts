import { Component, OnInit } from '@angular/core';
import { SystemConstants } from 'app/core/common/system.constant';
import { UrlConstants } from 'app/core/common/url.constant';
import { LoggedInUser } from 'app/core/domain/loggedin.user';
import { UtilityService } from 'app/core/services/utility.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API; 
  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
  }

  logout(){
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }

}
