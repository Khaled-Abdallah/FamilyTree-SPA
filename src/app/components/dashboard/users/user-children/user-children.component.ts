import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { ModalService } from '../../../../services/modal.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Chilred } from '../../../../models/chilred';
import { FileUploadService } from '../../../../services/file-upload.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'user-children',
  templateUrl: './user-children.component.html',
  styleUrls: ['./user-children.component.css']
})
export class UserChildrenComponent implements OnInit {
  @Input() userChildren: any[];
  addUserForm: FormGroup;
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
  
  constructor(private userService: UserService,private modalService: ModalService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.getFamily();
    this.getStatus();
    this.getGenderTypes();
    this.getwifes(this.userChildren[0].parentId);

    this.addUserForm = this.fb.group({
      fullName: [, [Validators.required]],
      userName: [, [Validators.required]],
      password: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
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
      statusId: [, [Validators.required]]
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
  
  addChildren(model: Chilred) {
    //return;
    model.parentId = this.userChildren[0].parentId;
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
        //
      });

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

  

}
