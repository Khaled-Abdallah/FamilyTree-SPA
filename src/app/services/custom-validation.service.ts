import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor(private userService: UserService) { }

  userNameExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.userService.checkExsists("username", control.value)
            .subscribe(() => { resolve({'userNameExsist': true});}
                      ,() => { resolve(null); });
      },100);
    });
  }

    emailExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.userService.checkExsists("email", control.value)
            .subscribe(() => { resolve({'emailExsist': true});}
                      ,() => { resolve(null); });
      },100);
    });
  }

   phoneExsist(control: AbstractControl): ValidationErrors | null {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.userService.checkExsists("phone", control.value)
            .subscribe(() => { resolve({'phoneExsist': true});}
                      ,() => { resolve(null); });
      },100);
    });
  }
  
}
