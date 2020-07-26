import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { UserInfo } from '../../../../models/userInfo';
import { UserLoginData } from '../../../../models/userLoginData';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  userLoginForm: FormGroup;
  @Input() userLogin: any = {};
  loadingEditing: boolean;
  
  constructor(private fb: FormBuilder,private userService: UserService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
    
    this.userLoginForm = this.fb.group({
      id: [this.userLogin.id],
      userName: [this.userLogin.userName, [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]]    
    });
  }
  
  updateUserLogin(model: UserLoginData) {
    this.loadingEditing = true;
    this.userService.updateUserLoginData(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم التعديل بنجاح');
          this.loadingEditing = false;
        }, 100);
      }, (err) => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية التعديل ... يرجي المحاولة مرة اخرى ');
          this.loadingEditing = false;
        }, 100);
      }, () => {
       
      });

  }

//   passwordConfirming(c: AbstractControl): { invalid: boolean } {
//     debugger
//     if (c.get('newPassword').value !== c.get('confirmNewPassword').value) {
//         return {invalid: true};
//     }
// }

}
