import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './sharing/header/header.component';
import { NavbarComponent } from './sharing/navbar/navbar.component';
import { ConactusComponent } from './components/ConactUS/conactus/conactus.component';
import { HomeComponent } from './components/home/home/home.component';
import { AboutComponent } from './components/about/about/about.component';
import { NotfindComponent } from './components/notfind/notfind/notfind.component';
import { FooterComponent } from './sharing/footer/footer.component';
import { SectionsComponent } from './components/sections/sections/sections.component';
import { PhotoNewsComponent } from './components/photoNews/photo-news/photo-news.component';
import { ChoicesComponent } from './components/choices/choices/choices.component';
import { FollowComponent } from './components/follow/follow/follow.component';
import { VideoMoreComponent } from './components/video-more/video-more/video-more.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { SectionsModule } from './NewSections/sections.module';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { SearchComponent } from './sharing/search/search.component';
import { SearchService } from './sharing/search.service';
import { MoreReadComponent } from './components/more-read/more-read.component';
import { BreakingNewsComponent } from './components/breaking-news/breaking-news.component';

// Angulartics2 Analytics
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

    ConactusComponent,

    AboutComponent,
    NotfindComponent,
    FooterComponent,








  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SectionsModule,
    HomeComponent,
    FollowComponent,
    SectionsComponent,
    PhotoNewsComponent,
    ChoicesComponent,
    VideoMoreComponent,
    SearchComponent,
    MoreReadComponent,
    FormsModule,
    BreakingNewsComponent,
    NavbarComponent,

    // Angulartics2 — auto page tracking
    Angulartics2Module.forRoot(),

  ],

  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
