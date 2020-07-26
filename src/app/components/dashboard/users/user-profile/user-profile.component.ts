import { Component, OnInit, TemplateRef } from '@angular/core';
import { AlertifyService } from '../../../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../../../../services/file-upload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UserService } from '../../../../services/user.service';
import { UserToUpdate } from '../../../../models/userToUpdate';
import { ModalService } from '../../../../services/modal.service';
import { UserProfile } from '../../../../models/userProfile';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePath: string;
  imgToUpload: File = null;
  loading: boolean;
  imageName: string = "";
  imgUrl = environment.imageUrl + "UserImages/";
  loadingImage: boolean; 
  isUpload: boolean;
  user: any;
  bsConfig: Partial<BsDatepickerConfig>;
  birthDateH: any;
  userToUpdate: UserToUpdate = new UserToUpdate();
  loadingPass: boolean;
  genderTypes: any;
  loadingDateH: any;
  minDate: Date;
  maxDate: Date;

  constructor(private alertifyService: AlertifyService, private fb: FormBuilder, public authService: AuthService,
    private route: ActivatedRoute,private userService: UserService,
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    private spinner: NgxSpinnerService) {
      // this.minDate = new Date();
      // this.minDate.setDate(this.minDate.getDate() - 60);      
     }

  ngOnInit() {
    this.loadUserData();
    this.getGenderTypes();
    
    this.profileForm = this.fb.group({
      id: [],
      fullName: [this.user.fullName, [Validators.required]],
      userName: [this.user.userName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phoneNumber: [this.user.phoneNumber, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      birthDateM: [this.user.birthDateM ,[Validators.required]],
      birthDateH: [, [Validators.required]],
      faceBookAcc: [this.user.faceBookAcc],
      jobTitle: [this.user.jobTitle],
      twitterAcc: [this.user.twitterAcc],
      workAddress: [this.user.workAddress],
      address: [this.user.address],
      genderId: [this.user.genderId, [Validators.required]]
    });

      if (this.user.image == null || this.user.image == "") {
        this.imagePath = "../../../assets/users/user.png";
      }
      else {
        this.imagePath = this.imgUrl + this.user.image;
      }

      this.bsConfig = {
        containerClass: 'theme-green',
        dateInputFormat: 'YYYY/MM/DD' ,
        isAnimated: true
      };
  }

  getGenderTypes() {
    this.userService.getGenderTypes()
      .subscribe(_genderTypes => {
        this.genderTypes = _genderTypes;
      });
  }  


  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  loadUserData(){
    this.imageName = "";
    this.route.data.subscribe(data => {
        this.user = data['userProfile'];
      });
  } 

  getDateH(date: Date){
    this.loadingDateH = true;
    var newDate = date.toLocaleDateString();
    this.userService.getBirthDateH(newDate)
      .subscribe(dateH => {
        setTimeout(() => {        
        this.birthDateH = dateH;
        this.loadingDateH = false;
      }, 100);
    },(err) => {
        setTimeout(() => {     
          console.log(err);
          this.loadingDateH = false;
        }, 100);       
      },() => {
      });
  }

  update(model: UserProfile) {
    debugger
    this.loading = true;
    model.id = this.user.id;
    var dateM = new Date(model.birthDateM);
    model.birthDateM = dateM.toLocaleDateString();

    this.authService.updateProfile(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم التعديل بنجاح');
          this.loading = false;
        }, 100);
      }, (err) => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية التعديل ');
          this.loading = false;
        }, 100);
      }, () => {
        this.loadUserData();
      });

  }
  
  uploadImage(file: FileList){
    
    this.loadingImage = true;    
    this.imgToUpload = file.item(0);

    this.fileUploadService.postFile(this.imgToUpload, "UserImages")
    .subscribe((res) => {
      setTimeout(() => {
        debugger
        this.imageName = res;

        if (this.imageName !== "" ) {
          this.authService.changeUserImage(this.imageName);
          //this.authService.currenyUser.imagePath = this.imageName;
          this.authService.currenyUser = this.imageName;
        }

        this.userToUpdate.id = this.user.id;
        this.userToUpdate.image = this.imageName;        
        this.updateUserImage(this.userToUpdate);
       
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.imagePath = event.target.result;
        }
        reader.readAsDataURL(this.imgToUpload);
        
      }, 100);
    }, 
    () => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى رفع الصوره");      
          this.loadingImage = false;
      }, 100);
         
    },() =>{
      setTimeout(() => {
        this.loadingImage = false;        
      }, 100);
          
    });

  }

  updateUserImage(userToUpdate: UserToUpdate){
    this.authService.updateUserImage(userToUpdate)
    .subscribe(() => {   
          this.loadingImage = false;
          //this.alertifyService.tSuccess('تم تغيير الصورة بنجاح ');
    }, (err) => {
          this.alertifyService.tError('خطأ فى عملية تغيير الصورة ');
    }, () => {
      
    });
  }

  updateUserPassword(oldPass: string, newPass: string, confirmNewPass: string,template: TemplateRef<any>,template2: TemplateRef<any>,template3: TemplateRef<any>){ 
    if(oldPass == '' || newPass == '' || confirmNewPass == ''){
      this.modalService.showConfirmModal(template2);
      return;
    }
    else if (newPass.trim() != confirmNewPass.trim()){
      this.modalService.showConfirmModal(template);
      return;
    }
    else if(newPass.length < 6 || confirmNewPass.length < 6){
      this.modalService.showConfirmModal(template3);
      return;
    }

    this.loadingPass = true;   
    this.userToUpdate.id = this.user.id;
    this.userToUpdate.oldPassword = oldPass;
    this.userToUpdate.newPassword = newPass;
    
    this.authService.updateUserPassword(this.userToUpdate)
    .subscribe(() => {
      setTimeout(() => {        
        this.alertifyService.tSuccess('تم تعديل كلمة المرور بنجاح ');
        this.loadingPass = false;    
      }, 100);
    }, (err) => {
      setTimeout(() => {        
        this.alertifyService.tError('كلمة المرور الحالية غير صحيحة ');
        this.loadingPass = false;
      }, 100);
    }, () => {
          //this.loadUserData();
    });

  }

  closeModal() {
    this.modalService.hideModal();     
  }


}
