import { NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sys-ctrl/sharing/navbar/navbar.component';
import { SidebarComponent } from './sys-ctrl/sharing/sidebar/sidebar.component';
import { SysCtrlModule } from './sys-ctrl/0sys-ctrl/sys-ctrl.module';

import { CommentViewComponent } from './components/update/comment-view/comment-view.component';


import { DollerViewComponent } from './components/dollar/doller-view/doller-view.component';
import { VidoeComponent } from './components/vidoe/vidoe/vidoe.component';
import { AddPostsComponent } from './components/posts/add-posts/add-posts.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { PartsComponent } from './components/parts/parts/parts.component';
import { OptionesComponent } from './components/options/optiones/optiones.component';
import { MembersComponent } from './components/members/members/members.component';
import { MaillistComponent } from './components/mailList/maillist/maillist.component';
import { MailComponent } from './components/main/mail/mail.component';
import { PagesComponent } from './components/pages/pages/pages.component';
import { NewComponent } from './components/new/new.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { UploadComponent } from './components/upload/upload/upload.component';
import { BreakingNewsComponent } from './components/breaking-news/breaking-news.component';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './sys-ctrl/change-password/change-password.component';
import { AuthInterceptor } from './sys-ctrl/services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,

    CommentViewComponent,


    DollerViewComponent,

    AddPostsComponent,
    PartsComponent,
    OptionesComponent,
    MembersComponent,
    MaillistComponent,
    MailComponent,
    PagesComponent,
    NewComponent,
    UploadComponent,
    BreakingNewsComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SysCtrlModule,
    AngularEditorModule,
    FormsModule,
    HttpClientModule,
    NgOptimizedImage,
    VidoeComponent,
    RouterModule,

    NgbModule,

    ReactiveFormsModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

