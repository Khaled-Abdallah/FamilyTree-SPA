import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SettingImage } from 'src/app/models/settingImage';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalService } from 'src/app/services/modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-firt-settings',
  templateUrl: './firt-settings.component.html',
  styleUrls: ['./firt-settings.component.css']
})
export class FirtSettingsComponent implements OnInit {
  settingForm: FormGroup;
  settings: any;
  loading: boolean;
  isUpload:any;
  loadingImage: any;
  userRole: string = "";

  imageURL = environment.imageUrl + "Logos/";

  appLogo: string = "../../../assets/users/NoImage2.jpg";
  cPanelLogo:string = "../../../assets/users/NoImage2.jpg";
  loginLogo: string = "../../../assets/users/NoImage2.jpg";;

  imgToUpload: File = null;

  loadingAppImage: boolean;
  loadingcPanelImage: boolean;
  loadingLoginImage: boolean;

  imageName: string = '';
  settingImage: SettingImage = new SettingImage();
  settingsData: SettingImage = new SettingImage();
  
  constructor(private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private authService: AuthService) { }

  
    
  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    this.getSetting();

    this.settingForm = this.fb.group({
      id: [0],
      appName: ['', [Validators.required]],
      mailAddress:  [, [Validators.required ]],
      mailServerPort:  ['', [Validators.required ]],
      mailUserName:  ['', [Validators.required ]],
      mailPassword:  ['', [Validators.required ]],
      mailServer:  ['', [Validators.required ]],
    });
  }

  getSetting() {
    this.settingsService.getSettings()
      .subscribe((_setting: any) => {
        this.settings = _setting;
        if(_setting != null){
            this.settingForm.controls['id'].setValue(_setting.id);
            this.settingForm.controls['appName'].setValue(_setting.appName);
            this.settingForm.controls['mailAddress'].setValue(_setting.mailAddress);
            this.settingForm.controls['mailServerPort'].setValue(_setting.mailServerPort);
            this.settingForm.controls['mailUserName'].setValue(_setting.mailUserName);
            this.settingForm.controls['mailPassword'].setValue(_setting.mailPassword);
            this.settingForm.controls['mailServer'].setValue(_setting.mailServer);

            // this.appLogo = this.imageURL + this.settings.appLogo;
            // this.cPanelLogo = this.imageURL + this.settings.cPanelLogo;
            // this.loginLogo = this.imageURL + this.settings.loginLogo;

            if (this.settings.appLogo == null || this.settings.appLogo == '') {
              this.appLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.appLogo = this.imageURL + this.settings.appLogo;
            }
    
            if (this.settings.cPanelLogo == null || this.settings.cPanelLogo == '') {
              this.cPanelLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.cPanelLogo = this.imageURL + this.settings.cPanelLogo;
            }
    
            if (this.settings.loginLogo == null || this.settings.loginLogo == '') {
              this.loginLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.loginLogo = this.imageURL + this.settings.loginLogo;
            }
        }
        else{
          // this.appLogo = "../../../assets/users/NoImage2.jpg";
          // this.cPanelLogo = "../../../assets/users/NoImage2.jpg";
          // this.loginLogo = "../../../assets/users/NoImage2.jpg";
        }

      },() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... حاول مرة اخرى");
      },() => {

      });
  }

  
  getSettings() {
    this.settingsService.getSettings()
      .subscribe((_setting: any) => {
        this.settings = _setting;
        if(_setting != null){
            this.settingForm.controls['id'].setValue(_setting.id);
            this.settingForm.controls['appName'].setValue(_setting.appName);
            this.settingForm.controls['mailAddress'].setValue(_setting.mailAddress);
            this.settingForm.controls['mailServerPort'].setValue(_setting.mailServerPort);
            this.settingForm.controls['mailUserName'].setValue(_setting.mailUserName);
            this.settingForm.controls['mailPassword'].setValue(_setting.mailPassword);
            this.settingForm.controls['mailServer'].setValue(_setting.mailServer);

            // this.appLogo = this.imageURL + this.settings.appLogo;
            // this.cPanelLogo = this.imageURL + this.settings.cPanelLogo;
            // this.loginLogo = this.imageURL + this.settings.loginLogo;

            if (this.settings.appLogo == null || this.settings.appLogo == '') {
              this.appLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.appLogo = this.imageURL + this.settings.appLogo;
            }
    
            if (this.settings.cPanelLogo == null || this.settings.cPanelLogo == '') {
              this.cPanelLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.cPanelLogo = this.imageURL + this.settings.cPanelLogo;
            }
    
            if (this.settings.loginLogo == null || this.settings.loginLogo == '') {
              this.loginLogo = "../../../assets/users/NoImage2.jpg";
            }
            else{
              this.loginLogo = this.imageURL + this.settings.loginLogo;
            }
        }
        else{
          // this.appLogo = "../../../assets/users/NoImage2.jpg";
          // this.cPanelLogo = "../../../assets/users/NoImage2.jpg";
          // this.loginLogo = "../../../assets/users/NoImage2.jpg";
        }

      },() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... حاول مرة اخرى");
      },() => {

      });
  }
  
  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  resetForm(){
    this.settingForm.reset();
  }

   onSubmit(model: any){
    if(model.id == 0 || model.id == undefined){
      this.loading = true;      
      this.settingsService.addSettings(model)
        .subscribe((_setting: any) => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تم الحفظ  بنجاح");
            this.authService.changeAppName(model.appName);
            this.settingsData = _setting;
          }, 100);
        }, () => {
          setTimeout(() => {            
            this.alertifyService.tError("خطأ فى عملية الحفظ .. يرجى المحاولة مرة اخرى");
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {         
             this.loading = false;           
            this.getSetting();
          }, 100);
        });
    }
    else{
      this.loading = true;      
      this.settingsService.updateSettings(model)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم التعديل بنجاح'); 
            this.authService.changeAppName(model.appName);
          }, 300);
        }, () => {
          setTimeout(() => {            
            this.alertifyService.tError('خطأ فى عملية التعديل ... يرجى الحاولة مرة اخرى');
            this.loading = false;
          }, 300);
        }, () => {
          setTimeout(() => {         
             this.loading = false;           
            this.getSetting();     
          }, 300);
        });
    }
  }

  updateSettingImage(logoName: string, settingImage: SettingImage){
    this.settingsService.saveImageSetting(logoName, settingImage)
    .subscribe(() => {
          //this.alertifyService.tSuccess('تم حفظ الوجو بنجاح ');
    }, (err) => {
          this.alertifyService.tError('خطأ فى عملية حفظ الوجو ');
    }, () => {
    });
  }

  changeAppName(){
    this.authService.changeAppName(this.imageName);
  }

  //====================================
  
  showAppLogoImage(){
    var reader = new FileReader();
        reader.onload = (event:any) => {
          this.appLogo = event.target.result;
        }
        reader.readAsDataURL(this.imgToUpload);
  }

  showCPanelLogoImage(){
    var reader = new FileReader();
        reader.onload = (event:any) => {
          this.cPanelLogo = event.target.result;
        }
        reader.readAsDataURL(this.imgToUpload);
        this.authService.changeAppLogo(this.imageName);
  }

  showLoginLogoImage(){
    var reader = new FileReader();
        reader.onload = (event:any) => {
          this.loginLogo = event.target.result;
        }
        reader.readAsDataURL(this.imgToUpload);
  }

  uploadImage(file: FileList, logoName: string){
    debugger
    if(this.settingsData.id == 0 || this.settingsData.id == undefined){
      alert("من فضلك قم بتسجيل اعدادات النظام الاساسية اولا!");
    }
    else{
      try{
          this.loadingAppImage = true;    
          this.imgToUpload = file.item(0);

          this.fileUploadService.postFile(this.imgToUpload, "Logos")
          .subscribe((imageResult) => {
            setTimeout(() => {
              debugger
              this.imageName = imageResult;
              
              if(logoName == 'AppLogo'){
                this.settingImage.id = this.settings.id;
                this.settingImage.appLogo = imageResult;        
                this.showAppLogoImage();
                this.updateSettingImage(logoName ,this.settingImage);
              }
              else if(logoName == 'CPanelLogo'){
                this.settingImage.id = this.settings.id;
                this.settingImage.cPanelLogo = imageResult;  
                this.showCPanelLogoImage();      
                this.updateSettingImage(logoName ,this.settingImage);
              }
              else{
                this.settingImage.id = this.settings.id;
                this.settingImage.loginLogo = imageResult;
                this.showLoginLogoImage();   
                this.updateSettingImage(logoName ,this.settingImage);
              }
                    
            }, 100);
          }, 
          () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى رفع الصوره");      
              this.loadingAppImage = false; 
            }, 100);
              
          },() =>{
            setTimeout(() => {
              this.loadingAppImage = false;        
            }, 100);
                
          });
      }
      catch{
        this.alertifyService.tError(" خطأ فى رفع الصوره ... حاول مرة اخرى");
      }
  }

  }

  continue(){
    debugger
    if(this.settingsData.id == 0){
      alert("عفوا... ادخل اعدادت النظام الاساسية");
      return;
    }

    this.router.navigate(['/admin', 'home']);
  }

}
