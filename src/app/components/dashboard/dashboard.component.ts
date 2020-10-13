import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router,Event, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from 'src/app/services/modal.service';
import { NgProgressComponent, NgProgressRef, NgProgress } from '@ngx-progressbar/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { NewsService } from '../../services/news.service';
//import $ from 'jquery';
declare var $: any;
import * as signalR from '@aspnet/signalr';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  // animations: [
  //   trigger('fadeIn',[
  //     transition(':enter',
  //     [
  //       style({opacity:0}),
  //       animate(1000,style({opacity:1}))
  //     ])
  //   ])
  // ]
})
export class DashboardComponent implements OnInit {
  userName: any;
  cPanelLogo: any;
  //imagePath;
  imgPath = environment.imageUrl + "UserImages/";
  imgSettingPath = environment.imageUrl + "Logos/";
  imgUrl: string;
  cImgUrl: string;
  loadingNavigation: any;
  progressRef: NgProgressRef;
  _counter: number = 0;
  hubConnection: signalR.HubConnection;
  url = environment.url;
  appName: any;
  userRole: string = "";

  constructor(private router: Router, private authService: AuthService, 
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private progress: NgProgress,
    private newsService: NewsService,
    private alertifyService: AlertifyService) { }
  
  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    //lodding user image
    this.authService.currentImgUrl.subscribe(imgUrl => 
      {
        this.imgUrl = imgUrl
        this.imgUrl = localStorage.getItem('image');
      });
    this.userName = localStorage.getItem('user');

    //loading logo
    this.authService.appLogoUrl.subscribe(imgUrl => 
      {
        this.cImgUrl = imgUrl
        this.cImgUrl = localStorage.getItem('cImage');
      });
    this.cPanelLogo = localStorage.getItem('cImage');

     //loading app name
    this.authService.currentAppName.subscribe(_appName => 
      {
        this.appName = _appName
        this.appName = localStorage.getItem('appName');
      });
    this.appName = localStorage.getItem('appName');

    this.startConnection();
    this.getNotification();
  }

  startConnection(): void{
    this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(this.url + 'signalService')
          .build();
    
      this.hubConnection
          .start()
          .then()
          .catch(err => console.log('Error while starting connection: ' + err));
  }

  getNotification(): void { 
    this.hubConnection.on('getData', (data: any) => { 
      console.log(data);
      if(data != null){
        this._counter++;
        this.alertifyService.tSuccess("تم اضافة خبر جديد");
      }
    });
  }

  showNotifications(){
    alert("notofications");
  }

  logout(){
    this.authService.logout();
  }
  
  onKeydown(value: string, template: TemplateRef<any>) {
    let valueToSreach = value.toLowerCase();

    switch(valueToSreach) { 
      case 'الفئات': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','category']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      } 
      case 'المنتجات': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','product']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'المزارع': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','farm']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'فئات المزارع': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','farm-category']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'منتجات المزارع': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','farm-products']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'طلبات العملاء': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','customers-requests']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'العملاء': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','customer']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'المستخدمين': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','users']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'الشكاوى': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','complaint']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'طرق الدفع': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','general-setting']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'انواع الشكاوى': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','general-setting']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'بيانات الشركة': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','general-setting']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      case 'الرئيسية': { 
        this.spinner.show();
        setTimeout(() => {     
            this.router.navigate(['/admin','home']);   
            this.spinner.hide(); 
        }, 1000);
         break; 
      }
      default: { 
        this.modalService.showConfirmModal(template);
         break; 
      } 
   }
  }

  decline(): void {
    this.modalService.hideModal();
  }

  /////loading templates js after dom render  
  ngAfterViewInit() {
    $.getScript('../../assets/plugins/custombox/dist/custombox.min.js', function () {
    }); 
    $.getScript('../../assets/plugins/custombox/dist/legacy.min.js', function () {
    });
    $.getScript('../../assets/js/jquery.core.js', function () {
    });    
    $.getScript('../../assets/js/jquery.app.js', function () {
    }); 
    $.getScript('../../assets/js/waves.js', function () {
    });
  }

  changeRoute(url) {
    debugger
    this.router.navigate(['/admin', 'family-tree']);
    //this.router.navigateByUrl('/admin/family-tree', { skipLocationChange: true });
    //setTimeout(() => this.router.navigate(url));
  }
 

}
