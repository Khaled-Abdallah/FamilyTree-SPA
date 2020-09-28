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
import { SettingsService } from 'src/app/services/settings.service';


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
  settings: any;
  noSettings: boolean ;
  
  constructor(private router: Router ,
              private alertifyService: AlertifyService,
              private fb: FormBuilder,
              private authService: AuthService,
              private settingsService: SettingsService) 
   {
      // this.online$ = merge(
      //   of(navigator.onLine),
      //   fromEvent(window, 'online').pipe(mapTo(true)),
      //   fromEvent(window, 'offline').pipe(mapTo(false))
      // );

      //this.initialData();
   }

    ngOnInit() {
      this.loginForm = this.fb.group({
        username: ['',[ Validators.required]],
        password: ['', [Validators.required]]
      });

      this.noSettings = false;
      this.getSetting();  
    }

    login(model){
      this.loading = true;
      this.authService.login(model).subscribe(next => {
        setTimeout(()=> {
          debugger     
          if(this.noSettings == true){
            this.router.navigate(['/first-Settings']);   
          }
          else{
            this.router.navigate(['/admin', 'home']);
          }
        }, 100); 
      }, (err) => {
        setTimeout(()=> {
          if(err.error == "loucked"){
            this.alertifyService.tError('عفوا... تم ايقاف الحساب');
          }
          else{
            this.alertifyService.tError('خطأ فى اسم المستخدم او كلمة المرور');
          }         
          this.loading = false;
       }, 100);        
      }, () => {
        setTimeout(()=> {
          //
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

    getSetting() {
      this.settingsService.getSettings()
        .subscribe((_setting: any) => {
          this.settings = _setting;  
          if(_setting.id == 0){
            this.noSettings = true;
          }
          else{
            this.noSettings = false;
          }
        },() => {
          //this.alertifyService.tError("خطأ فى تحميل البيانات ... حاول مرة اخرى");
        },() => {
            //
        });
    }
    
  

}
