import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageContstants } from 'app/core/common/message.constant';
import { UrlConstants } from 'app/core/common/url.constant';
import { AuthenService } from 'app/core/services/authen.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  model: any = {};
  returnUrl: string;

  constructor(
    private authenService: AuthenService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.authenService.login(this.model.username, this.model.password)
      .subscribe(data => {
        this.router.navigate([UrlConstants.HOME]);
      }, error => {
        this.notificationService.printErrorMessage(MessageContstants.SYSTEM_ERROR_MSG);
        this.loading = false;
      });
  }

}
