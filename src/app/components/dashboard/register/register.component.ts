import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalService } from 'src/app/services/modal.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  genderTypes :any;
  family: any;
  status: any;
  bsConfig: Partial<BsDatepickerConfig>;
  loadingDateH: boolean;
  birthDateH: any;
  parents: any;
  loading: boolean;

  constructor(private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService) {
        
     }

  ngOnInit() {
    this.getGenderTypes();
        this.getFamily();
        this.getStatus();
        this.getParents();

    this.registerForm = this.fb.group({
      statusId: [, [Validators.required]],
      familyId: [, [Validators.required]],
      parentId: [, [Validators.required]],
      genderId: [, [Validators.required]],
      fullName: [, [Validators.required]],
      userName: [, [Validators.required]],
      password: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phoneNumber: [, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      birthDateM: [ ,[Validators.required]],
      birthDateH: [,]      
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

  getParents() {
    this.userService.getParents()
      .subscribe(_parents => {
        this.parents = _parents;
      });
  }
  
   
  save(model: any) {    
    this.loading = true;
    var dateM = new Date(model.birthDateM);
    model.birthDateM = dateM.toLocaleDateString();

    this.userService.save(model)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم الحفظ بنجاح');
          this.loading = false;
          this.getParents();
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

  
  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
