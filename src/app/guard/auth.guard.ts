import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@ Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService) 
    {}

  canActivate(): boolean {
    if (this.authService.loggedIn()){
        return true;
      }

      this.spinner.show();
      setTimeout(() => {
        this.alertify.tError('عفوا .. قم بتسجيل الدخول');
        this.router.navigate(['/login']);
        this.spinner.hide();
        return false;
      }, 100);

   
  }
}
