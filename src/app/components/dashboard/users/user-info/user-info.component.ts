import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AlertifyService } from '../../../../services/alertify.service';
import { Chilred } from '../../../../models/chilred';
import { UserInfo } from '../../../../models/userInfo';
import { FileUploadService } from '../../../../services/file-upload.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() userInfo: any = {};
  imgUrl = environment.imageUrl + "UserImages/";
  userInfoForm: FormGroup;
  //userInfo: any;
  loadingDateH: boolean;
  birthDateH: any;
  genderTypes: any;
  wifes: any;
  family: any;
  status: any;
  bsConfig: Partial<BsDatepickerConfig>;
  loadingEditing: any;
  imageName: string = "";
  imagePath: string = "../../../assets/users/user.png";
  loadingImage: boolean;
  imgToUpload: File = null;
  isUpload: any;

  constructor(private fb: FormBuilder,private userService: UserService,
    private alertifyService: AlertifyService,private fileUploadService: FileUploadService) { }

  ngOnInit() {
    //console.log(this.userInfo);

    if(this.userInfo.image == null){
      this.imagePath = "../../../assets/users/user.png";
    }
    else{
      this.imagePath = this.imgUrl + this.userInfo.image;
    }

    this.getwifes(this.userInfo.id);
    this.getGenderTypes();
    this.getFamily();
    this.getStatus();

    this.userInfoForm = this.fb.group({
      id: [this.userInfo.id],
      fullName: [this.userInfo.fullName, [Validators.required]],
      identityNumber: [this.userInfo.identityNumber, [Validators.required]],
      userName: [this.userInfo.userName, [Validators.required]],
      password: [],
      email: [this.userInfo.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phoneNumber: [this.userInfo.phoneNumber, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      birthDateM: [this.userInfo.birthDateM ,[Validators.required]],
      birthDateH: [this.userInfo.birthDateH, [Validators.required]],
      faceBookAcc: [this.userInfo.faceBookAcc],
      jobTitle: [this.userInfo.jobTitle],
      twitterAcc: [this.userInfo.twitterAcc],
      workAddress: [this.userInfo.workAddress],
      address: [this.userInfo.address, [Validators.required]],
      genderId: [this.userInfo.genderId, [Validators.required]],
      motherId: [this.userInfo.motherId],
      familyId: [this.userInfo.familyId, [Validators.required]],
      statusId: [this.userInfo.statusId, [Validators.required]],
      isLouck: [this.userInfo.isLouck]
    });
    
    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'YYYY/MM/DD' ,
      isAnimated: true
    };
    
  }

  uploadImage(file: FileList){
    this.loadingImage = true;    
    this.imgToUpload = file.item(0);

    this.fileUploadService.postFile(this.imgToUpload, "UserImages")
    .subscribe((res) => {
      setTimeout(() => {
        this.imageName = res;                
       
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

  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  getDateH(date: any){
    try{
      if(date != null){
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
    }
    catch {
      this.loadingDateH = false;
      return;
    }
    
  }

  getGenderTypes() {
    this.userService.getGenderTypes()
      .subscribe(_genderTypes => {
        this.genderTypes = _genderTypes;
      });
  }

  getwifes(userId: Number) {
    this.userService.getwifes(userId)
      .subscribe(_wifes => {
        this.wifes = _wifes;
      });
  }  

  getFamily() {
    this.userService.getFamily()
      .subscribe(_family => {
        this.family = _family;
      });
  }
  
  getStatus(){
    this.status = 
    [
      {id: 1, statusName: "حى"},
      {id: 2, statusName: "متوفى"}
    ];
  }

  updateUserInfo(model: UserInfo) {
    this.loadingEditing = true;

    model.parentId = this.userInfo.parentId;
    var dateM = new Date(model.birthDateM);
    model.birthDateM = dateM.toLocaleDateString();
    model.image = (this.imageName == "") ? this.userInfo.image : this.imageName;
    model.allowAddChildren = this.userInfo.allowAddChildren;
    model.allowAddFamilyChar = this.userInfo.allowAddFamilyChar;
    model.allowBlog = this.userInfo.allowBlog;
    model.allowNews = this.userInfo.allowNews;

    this.userService.updateUserInfo(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم التعديل بنجاح');
          this.imageName = "";
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


}
