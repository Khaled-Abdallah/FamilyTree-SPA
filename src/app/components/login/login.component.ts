import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { debug } from 'util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { trigger, transition, style, animation, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginStatus: boolean = true;
  user: User;
  imgPath: string;
  public loading: boolean;
  online$: Observable<boolean>;
  logoPath = environment.imageUrl + "Logos/";
  imageLogo:string = "";
  
  constructor(private router: Router ,
              private alertifyService: AlertifyService,
              private fb: FormBuilder,
              private authService: AuthService) 
   {
      this.online$ = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );
      this.initialData();
   }

    ngOnInit() {
      this.loginForm = this.fb.group({
        username: ['',[ Validators.required]],
        password: ['', [Validators.required]]
      });

      
    }

    login(model){
      this.loading = true;
      this.authService.login(model).subscribe(next => {
        setTimeout(()=> {
          //this.loading = false;
          this.router.navigate(['/admin', 'home']);      
        }, 100); 
      }, error => {
        setTimeout(()=> {
          this.alertifyService.tError('خطأ فى اسم المستخدم او كلمة المرور');          
          this.loading = false;
          //console.log(error);
       }, 100);        
      }, () => {
        setTimeout(()=> {
          //this.loading = false;
       }, 100);         
      });    
    }

    initialData(){
      this.authService.getLoginLogo()
        .subscribe(result => {
          if(result == ""){
            this.imageLogo = "defLogo3.png";
          }else{
            this.imageLogo = result.loginLogo;
          }
        }, () => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
        });
    }


  

}
