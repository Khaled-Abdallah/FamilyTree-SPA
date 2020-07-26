import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserToUpdate } from '../models/userToUpdate';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currenyUser: any;
  private baseUrl = environment.apiUrl + 'account/';
  baseImageUrl = environment.imageUrl + "UserImages/";
  jwtHelpler = new JwtHelperService();

  imgUrl = new BehaviorSubject<string>('user.png');
  cImgUrl = new BehaviorSubject<string>('user.png');
  appName = new BehaviorSubject<string>('user.png');
  
  currentImgUrl = this.imgUrl.asObservable();
  appLogoUrl = this.cImgUrl.asObservable();
  currentAppName = this.appName.asObservable();

  constructor(private http: HttpClient, private router: Router, private spinner: NgxSpinnerService) { }
  
    login(user: User) {
        return this.http.post(this.baseUrl + 'adminLogin', user)
          .pipe(map((response: any) => {
            const user = response;
            if (user) {
              localStorage.setItem('token', user.token);
              localStorage.setItem('user', user.user.userName);  

              this.currenyUser = user.user;                          
              this.changeUserImage(this.currenyUser.image);
              this.changeAppLogo(response.cPanelLogo);
              this.changeAppName(response.appName);
            }
          }));
    }

    changeUserImage(imgUrl: string) {
       if(imgUrl != null){
        localStorage.setItem('image', imgUrl);
        this.imgUrl.next(imgUrl);
       }
       else{
        var imgae = "user.png";
        localStorage.setItem('image', imgae);
        this.imgUrl.next(imgae);
       }
    }

    changeAppLogo(cImgUrl: string) {
      
      if(cImgUrl != null){
        localStorage.setItem('cImage', cImgUrl);
        this.cImgUrl.next(cImgUrl);
       }
       else{
        var imgae = "user.png";
        localStorage.setItem('cImage', imgae);
        this.cImgUrl.next(imgae);
       }
    }

    changeAppName(appName: string) {
      if(appName != null){
        localStorage.setItem('appName', appName);
        this.appName.next(appName);
      }
      else{
        var appName = "أسرة الثنيان";
        localStorage.setItem('appName', appName);
        this.appName.next(appName);
      }
    }

    checkExsist(type: string, feild: any){ 
      return this.http.get(this.baseUrl + 'checkExsist/' + type + '/' + feild);
    }

    //for users
    updateUser(user: any) {
      return this.http.post(this.baseUrl + 'updateUser' , user)
    }
    
    updateProfile(user: any) {
      return this.http.post(this.baseUrl + 'updateProfile' , user)
    }
               
    getUsers(): any {
      return this.http.get(this.baseUrl + 'getUsers');
    }

    getCustomers(): any {
      return this.http.get(this.baseUrl + 'getCustomers');
    }

    getUser(id: Number): any {
      return this.http.get(this.baseUrl + 'getUser/' + id);
    }

    getUserLogin(): any {
      return this.http.get(this.baseUrl + 'getUserLogin');
    }

    deleteUser(id: Number): any {
      return this.http.get(this.baseUrl + 'deleteUser/' + id);
    }

    register(user: User, type: string) {
      return this.http.post(this.baseUrl + 'register/'+ type, user);
    }

    loggedIn() {
      const token = localStorage.getItem('token');
      return !this.jwtHelpler.isTokenExpired(token);
    }

    public logout() {  
      let _token = localStorage.getItem('token');
      let _user = localStorage.getItem('user');

      this.spinner.show();
      setTimeout(() => {     
        if (_token && _user) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('image');
          localStorage.removeItem('cImage');
          this.router.navigate(['/login']);
          this.spinner.hide();
          return !this.jwtHelpler.isTokenExpired(_token);
        }
      }, 500);
    }

    activeCustomer(id: Number, status: boolean): any {
      return this.http.get(this.baseUrl + 'activeCustomer/' + id +'/' + status);
    }

    updateUserImage(userToUpdate: UserToUpdate) {
      return this.http.post(this.baseUrl + 'uploadUserImage' ,userToUpdate)
    }

    updateUserPassword(userToUpdate: UserToUpdate) {
      return this.http.post(this.baseUrl + 'updatePassword' ,userToUpdate)
    }

    getLoginLogo(): any {
      return this.http.get(this.baseUrl + 'getLoginLogo');
    }

}
