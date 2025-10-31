import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthLoginComponent
  ]
})
export class AuthModule {}
