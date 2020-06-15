import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from "./logout/logout.component";
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AlertComponent } from "./alert/alert.component";
import { PostTweetComponent } from "./post-tweet/post-tweet.component";
import { AdministratorComponent } from "./administrator/administrator.component";
import { JwtInterceptor } from "../_helpers/jwt.interceptor";
import { TweetListComponent } from "./tweet-list/tweet-list.component";

@
NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    AccountComponent,
    AlertComponent,
    PostTweetComponent,
    AdministratorComponent,
    TweetListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'account/:id', component: AccountComponent },
      { path: 'administrator', component: AdministratorComponent }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
