import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Main2Component } from './part-2/main-2/main2/main2.component';
import { Sub2Component } from './part-2/sub-2/sub2/sub2.component';
import { Main5Component } from './part-5/main-5/main5/main5.component';
import { Sub5Component } from './part-5/sub-5/sub5/sub5.component';
import { Main6Component } from './part-6/main-6/main6/main6.component';
import { Sub6Component } from './part-6/sub-6/sub6/sub6.component';

import { Sub7Component } from './part-7/sub-7/sub7/sub7.component';
import { Main8Component } from './part-8/main-8/main8/main8.component';
import { Sub8Component } from './part-8/sub-8/sub8/sub8.component';
import { Sub9Component } from './part-9/sub-9/sub9/sub9.component';
import { Main9Component } from './part-9/main-9/main9/main9.component';
import { Sub10Component } from './part-10/sub-10/sub10/sub10.component';
import { Main10Component } from './part-10/main-10/main10/main10.component';
import { Sub11Component } from './part-11/sub-11/sub11/sub11.component';
import { Main11Component } from './part-11/main-11/main11/main11.component';
import { Sub19Component } from './part-19/sub-19/sub19/sub19.component';
import { Main20Component } from './part-20/main-20/main20/main20.component';
import { Sub20Component } from './part-20/sub-20/sub20/sub20.component';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Sub16Component } from './part-16/sub-16/sub16/sub16.component';
import { Main16Component } from './part-16/main-16/main16/main16.component';
import { Main7Component } from './part-7/main-7/mian7/main7.component';
import { Main19Component } from './part-19/main19/main19.component';
import { Main1Component } from './part-1/main-1/main/main1.component';
import { Sub1Component } from './part-1/sub-1/sbu/sub1.component';


@NgModule({
  declarations: [
   

  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    Main11Component,
    Sub11Component,

    Main1Component,
    Sub1Component  ,

    Main2Component,
    Sub2Component,

    Main5Component,
     Sub5Component,

    Sub6Component,
    Main6Component,

    Main7Component,
     Sub7Component,

    Main8Component,
     Sub8Component,

    Main9Component,
     Sub9Component,

    Main10Component,
     Sub10Component,

    Main16Component,
     Sub16Component,

      Main19Component,
     Sub19Component,

    Main20Component,
      Sub20Component,

   

  ]
})
export class SectionsModule { }
