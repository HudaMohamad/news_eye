import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './sys-ctrl/login/login/login.component';
import { NavbarComponent } from './sys-ctrl/sharing/navbar/navbar.component';
import { SidebarComponent } from './sys-ctrl/sharing/sidebar/sidebar.component';

import { CommentViewComponent } from './components/update/comment-view/comment-view.component';

import { ChangePasswordComponent } from './sys-ctrl/change-password/change-password.component';

import { DollerViewComponent } from './components/dollar/doller-view/doller-view.component';
import { VidoeComponent } from './components/vidoe/vidoe/vidoe.component';
import { AddPostsComponent } from './components/posts/add-posts/add-posts.component';
import { PartsComponent } from './components/parts/parts/parts.component';
import { OptionesComponent } from './components/options/optiones/optiones.component';
import { MembersComponent } from './components/members/members/members.component';
import { MaillistComponent } from './components/mailList/maillist/maillist.component';
import { MailComponent } from './components/main/mail/mail.component';
import { PagesComponent } from './components/pages/pages/pages.component';
import { NewComponent } from './components/new/new.component';
import { UploadComponent } from './components/upload/upload/upload.component';
import { BreakingNewsComponent } from './components/breaking-news/breaking-news.component';

import { AuthGuard } from './sys-ctrl/services/auth.guard';

const routes: Routes = [
  // Login page (public)
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },

  {
    path: 'home',
    component: NavbarComponent,
    canActivate: [AuthGuard],  // Protected by auth guard
    children: [
      { path: '', component: SidebarComponent },
      { path: 'breaking-news', component: BreakingNewsComponent },

      { path: 'comment-view/:id', component: CommentViewComponent },

      { path: 'doller', component: DollerViewComponent },
      { path: 'add-psts', component: AddPostsComponent },
      { path: 'parts', component: PartsComponent },
      { path: 'optiones', component: OptionesComponent },
      { path: 'members', component: MembersComponent },
      { path: 'maillist', component: MaillistComponent },
      { path: 'main', component: MailComponent },
      { path: 'new', component: NewComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'upload', component: UploadComponent },

      { path: 'vidoe', component: VidoeComponent },

    ]
  },

  // Default → login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Unknown routes → login
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
