import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { ModalService } from '../../../../services/modal.service';
import { FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Chilred } from '../../../../models/chilred';
import { FileUploadService } from '../../../../services/file-upload.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UserInfo } from 'src/app/models/userInfo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-children',
  templateUrl: './user-children.component.html',
  styleUrls: ['./user-children.component.css']
})
export class UserChildrenComponent implements OnInit {
  @Input() userChildren: any[];
  @Input() userId: any;  
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  loadingDateH: boolean;
  birthDateH: any;
  loading: any;
  imageName: string = "";
  imagePath: string = "../../../assets/users/user.png";
  loadingImage: boolean;
  imgToUpload: File = null;
  family: any;
  status: any;
  genderTypes: any;
  wifes: any;
  isUpload: any;
  bsConfig: Partial<BsDatepickerConfig>;
  userIdToDelete: Number;
  loadingDelete : any;
  title: any;
  userToEdite :any;
  loadingEditing: any;
  imgUrl = environment.imageUrl + "UserImages/";
  userRole: string = "";
  
  constructor(private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    //console.log(this.userChildren);
    this.getFamily();
    this.getStatus();
    this.getGenderTypes();
    if(this.userChildren.length != 0)
       this.getwifes(this.userChildren[0].parentId);

    this.addUserForm = this.fb.group({
      id: [0],
      fullName: [, [Validators.required]],
      userName: [, [Validators.required]],
      password: [, [Validators.required, Validators.minLength(6)]],
      email: [, [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phoneNumber: [, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      birthDateM: [ ,[Validators.required]],
      birthDateH: [, [Validators.required]],
      faceBookAcc: [],
      jobTitle: [],
      twitterAcc: [],
      workAddress: [],
      address: [],
      genderId: [, [Validators.required]],
      motherId: [, [Validators.required]],
      familyId: [, [Validators.required]],
      statusId: [, [Validators.required]],
      isLouck: [false]
    });

    this.editUserForm = this.fb.group({
      id: [0],
      fullName: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phoneNumber: [, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      birthDateM: [ ,[Validators.required]],
      birthDateH: [, [Validators.required]],
      faceBookAcc: [],
      jobTitle: [],
      twitterAcc: [],
      workAddress: [],
      address: [],
      genderId: [, [Validators.required]],
      motherId: [],
      familyId: [, [Validators.required]],
      statusId: [, [Validators.required]],
      isLouck: [false]
    });

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

  getUserChildren(parentId: Number) {
    this.userService.getUserChildren(parentId)
      .subscribe(_userChildren => {
        this.userChildren = _userChildren;
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

  showAdd(template: TemplateRef<any>){
    this.title = "إضافة ابن";
    this.modalService.showModal(template);
  }
        
  getDateH(date: Date){
    if(date != null){
      //this.spinner.show();
      this.loadingDateH = true;
      var newDate = date.toLocaleDateString();
      this.userService.getBirthDateH(newDate)
        .subscribe(dateH => {
          setTimeout(() => {        
          this.birthDateH = dateH;
          //this.spinner.hide();
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

  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  closeModal() {
    this.modalService.hideModal();    
    this.addUserForm.reset();
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

  openConfirmDelete(id: Number, template: TemplateRef<any>) {
    debugger;
    this.userIdToDelete = id;
    this.modalService.showConfirmModal(template);
  }

  deleteUser(){
    this.loadingDelete = true;
    this.userService.deleteUser(this.userIdToDelete)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تم الحذف بنجاح");
            this.getUserChildren(this.userId);
            this.loadingDelete = false;
            this.closeModal();
          }, 100);
        }, (err) => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية الحذف .. يرجى مراجعة الدعم الفنى");
            this.loadingDelete = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loadingDelete = false;
          }, 100);
        });
  }  
    
  addUser(model: Chilred) {
    model.parentId = this.userId;
    this.loading = true;
    var dateM = new Date(model.birthDateM);
    model.birthDateM = dateM.toLocaleDateString();
    model.image = (this.imageName == "") ? null : this.imageName;

    this.userService.addChildren(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم الحفظ بنجاح');
          this.getUserChildren(this.userChildren[0].parentId)
          this.imageName = "";
          this.loading = false;
          this.closeModal();
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية الحفظ ... يرجي المحاولة مرة اخرى ');
          this.loading = false;
        }, 100);
      }, () => {
        //////////
      });
  }

  showUpdateUser(id: Number, template: TemplateRef<any>){
    this.userToEdite = this.userChildren.find(u => u.id == id);
    //console.log(this.userToEdite);

    this.editUserForm.controls['id'].setValue(this.userToEdite.id);
    this.editUserForm.controls['fullName'].setValue(this.userToEdite.fullName);
    this.editUserForm.controls['email'].setValue(this.userToEdite.email);
    this.editUserForm.controls['phoneNumber'].setValue(this.userToEdite.phoneNumber);
    this.editUserForm.controls['birthDateM'].setValue(this.userToEdite.birthDateM);
    this.editUserForm.controls['birthDateH'].setValue(this.userToEdite.birthDateH);
    this.editUserForm.controls['faceBookAcc'].setValue(this.userToEdite.faceBookAcc);
    this.editUserForm.controls['jobTitle'].setValue(this.userToEdite.jobTitle);
    this.editUserForm.controls['twitterAcc'].setValue(this.userToEdite.twitterAcc);
    this.editUserForm.controls['workAddress'].setValue(this.userToEdite.workAddress);
    this.editUserForm.controls['address'].setValue(this.userToEdite.address);
    this.editUserForm.controls['genderId'].setValue(this.userToEdite.genderId);
    this.editUserForm.controls['motherId'].setValue(this.userToEdite.motherId);
    this.editUserForm.controls['familyId'].setValue(this.userToEdite.familyId);
    this.editUserForm.controls['statusId'].setValue(this.userToEdite.statusId);
    this.editUserForm.controls['isLouck'].setValue(this.userToEdite.isLouck);
    
    if(this.userToEdite.image == null){
      this.imagePath = "../../../assets/users/user.png";
    }
    else{
      this.imagePath = this.imgUrl + this.userToEdite.image;
    }

    this.modalService.showModal(template);
  }

  @Output() getUserInfo: EventEmitter<any> = new EventEmitter();

  editUser(model: UserInfo){
    this.loadingEditing = true;
    model.parentId = this.userToEdite.parentId;
    var dateM = new Date(model.birthDateM);
    model.birthDateM = dateM.toLocaleDateString();
    model.image = (this.imageName == "") ? this.userToEdite.image : this.imageName;
    model.userName = this.userToEdite.userName;
    model.allowAddChildren = this.userToEdite.allowAddChildren;
    model.allowAddFamilyChar = this.userToEdite.allowAddFamilyChar;
    model.allowBlog = this.userToEdite.allowBlog;
    model.allowNews = this.userToEdite.allowNews;

    this.userService.updateUserInfo(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم التعديل بنجاح');
          this.imageName = "";
          this.loadingEditing = false;
          this.getUserInfo.emit();
          this.modalService.hideModal();
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
