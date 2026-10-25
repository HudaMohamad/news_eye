import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login/login.component';





@NgModule({
  declarations: [
    LoginComponent,

  ],
  imports: [
  CommonModule,
  FormsModule,
  HttpClientModule,
  ReactiveFormsModule,

  ]
})
export class SysCtrlModule { }
