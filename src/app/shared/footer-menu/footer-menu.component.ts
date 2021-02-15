import { Component, OnInit } from '@angular/core';
import { SystemConstants } from 'app/core/common/system.constant';
import { UrlConstants } from 'app/core/common/url.constant';
import { AuthenService } from 'app/core/services/authen.service';
import { UtilityService } from 'app/core/services/utility.service';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.css']
})
export class FooterMenuComponent implements OnInit {

  constructor(
    private authenService: AuthenService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }
}
