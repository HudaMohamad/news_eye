import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { AboutComponent } from './components/about/about/about.component';
import { ConactusComponent } from './components/ConactUS/conactus/conactus.component';
import { NotfindComponent } from './components/notfind/notfind/notfind.component';
import { Main1Component } from './NewSections/part-1/main-1/main/main1.component';
import { Sub1Component } from './NewSections/part-1/sub-1/sbu/sub1.component';
import { Main2Component } from './NewSections/part-2/main-2/main2/main2.component';
import { Main5Component } from './NewSections/part-5/main-5/main5/main5.component';
import { Main6Component } from './NewSections/part-6/main-6/main6/main6.component';
import { Main7Component } from './NewSections/part-7/main-7/mian7/main7.component';
import { Main8Component } from './NewSections/part-8/main-8/main8/main8.component';
import { Main9Component } from './NewSections/part-9/main-9/main9/main9.component';
import { Main10Component } from './NewSections/part-10/main-10/main10/main10.component';
import { Main11Component } from './NewSections/part-11/main-11/main11/main11.component';
import { Main16Component } from './NewSections/part-16/main-16/main16/main16.component';

import { Main20Component } from './NewSections/part-20/main-20/main20/main20.component';
import { Sub2Component } from './NewSections/part-2/sub-2/sub2/sub2.component';
import { Sub5Component } from './NewSections/part-5/sub-5/sub5/sub5.component';
import { Sub6Component } from './NewSections/part-6/sub-6/sub6/sub6.component';
import { Sub7Component } from './NewSections/part-7/sub-7/sub7/sub7.component';
import { Sub8Component } from './NewSections/part-8/sub-8/sub8/sub8.component';
import { Sub9Component } from './NewSections/part-9/sub-9/sub9/sub9.component';
import { Sub10Component } from './NewSections/part-10/sub-10/sub10/sub10.component';
import { Sub11Component } from './NewSections/part-11/sub-11/sub11/sub11.component';
import { Sub16Component } from './NewSections/part-16/sub-16/sub16/sub16.component';
import { Sub19Component } from './NewSections/part-19/sub-19/sub19/sub19.component';
import { Sub20Component } from './NewSections/part-20/sub-20/sub20/sub20.component';
import { Main19Component } from './NewSections/part-19/main19/main19.component';


const routes: Routes = [

   {path:'home', component:HomeComponent },
   {path:'about', component:AboutComponent},
   {path:'conact', component:ConactusComponent},

    {path: 'part-1',
    children: [
      { path: '', component: Main1Component },
      { path: 'sub-1/:id', component: Sub1Component } 
    ]
  },

    {path: 'part-2',
    children: [
      { path: '', component: Main2Component },
      { path: 'sub-2/:id', component:Sub2Component}
    ] },

    {path: 'part-5',
    children: [
      { path: '', component: Main5Component },
      { path: 'sub-5/:id', component: Sub5Component }
    ] },

    {path: 'part-6',
    children: [
      { path: '', component: Main6Component },
      { path: 'sub-6/:id', component: Sub6Component }
    ] },


       {path: 'part-7',
    children: [
      { path: '', component: Main7Component },
      { path: 'sub-7/:id', component: Sub7Component } 
    ]
  },

   
    {path: 'part-8',
    children: [
      { path: '', component: Main8Component },
      { path: 'sub-8/:id', component: Sub8Component }
    ] },

    {path: 'part-9',
    children: [
      { path: '', component: Main9Component },
      { path: 'sub-9/:id', component: Sub9Component }
    ] },

    {path: 'part-10',
    children: [
      { path: '', component: Main10Component },
      { path: 'sub-10/:id', component: Sub10Component }
    ] },

    {
    path: 'part-11',
    children: [
      { path: '', component: Main11Component },
      { path: 'sub-11/:id', component: Sub11Component } 
    ]
  },

       {path: 'part-16',
    children: [
      { path: '', component: Main16Component },
      { path: 'sub-16/:id', component: Sub16Component } 
    ]
  },



    {path: 'part-19',
    children: [
      { path: '', component:Main19Component},
      { path: 'sub-19/:id', component: Sub19Component }
    ] },

    {path: 'part-20',
    children: [
      { path: '', component: Main20Component},
      { path: 'sub-20/:id', component: Sub20Component }
    ] },


   { path: '', component:HomeComponent },
   {path:'**', component:NotfindComponent},

];




@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',           // تمكين النزول إلى الـ ID
      scrollPositionRestoration: 'enabled'  // تذكر مكان التمرير عند الرجوع
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }