import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor(private authService: AuthService) { }

  userNameExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.authService.checkExsist("username", control.value)
            .subscribe(() => { resolve({'userNameExsist': true});}
                      ,() => { resolve(null); });
      },500);
    });
  }

    emailExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.authService.checkExsist("email", control.value)
            .subscribe(() => { resolve({'emailExsist': true});}
                      ,() => { resolve(null); });
      },500);
    });
  }

   phoneExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.authService.checkExsist("phone", control.value)
            .subscribe(() => { resolve({'phoneExsist': true});}
                      ,() => { resolve(null); });
      },500);
    });
  }
  
}
