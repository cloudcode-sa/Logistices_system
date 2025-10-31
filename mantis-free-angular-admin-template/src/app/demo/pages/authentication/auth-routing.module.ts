import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { SpinnerComponent } from 'src/app/theme/shared/components/spinner/spinner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthLoginComponent,
    SpinnerComponent
  ]
})
export class AuthModule {}
