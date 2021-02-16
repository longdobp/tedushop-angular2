import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { mainRoutes } from './main.routes';
import { RouterModule } from '@angular/router';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { UtilityService } from '../core/services/utility.service';
import { AuthenService } from '../core/services/authen.service';
import { SidebarMenuComponent } from '../shared/sidebar-menu/sidebar-menu.component';
import { TopMenuComponent } from '../shared/top-menu/top-menu.component';
import {FooterMenuComponent} from '../shared/footer-menu/footer-menu.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProfileMenuComponent } from '../shared/profile-menu/profile-menu.component';
import { SignalrService } from '../core/services/signalr.service';

@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    UserModule,
    RouterModule.forChild(mainRoutes)
  ],
  declarations: [
    MainComponent,
    SidebarMenuComponent,
    TopMenuComponent,
    FooterMenuComponent,
    FooterComponent,
    ProfileMenuComponent
  ],
  providers: [
    UtilityService,
    AuthenService,
    SignalrService
  ]
})
export class MainModule { }
