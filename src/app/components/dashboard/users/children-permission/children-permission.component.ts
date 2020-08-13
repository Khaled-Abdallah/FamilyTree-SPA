import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ModalService } from 'src/app/services/modal.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserPermission } from 'src/app/models/userPermission';

@Component({
  selector: 'children-permission',
  templateUrl: './children-permission.component.html',
  styleUrls: ['./children-permission.component.css']
})
export class ChildrenPermissionComponent implements OnInit {
  @Input() userInfo: any = {};
  userPerForm: FormGroup;
  loading: any;
  
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.userPerForm = this.fb.group({
      id: [this.userInfo.id],
      allowAddChildren: [this.userInfo.allowAddChildren],
      allowAddFamilyChar: [this.userInfo.allowAddFamilyChar],
      allowBlog:  [this.userInfo.allowBlog],
      allowNews:  [this.userInfo.allowNews]
    });

    //console.log(this.userInfo);
  }

  updateUserPermission(model: any){
    var userPer = new UserPermission();
    userPer.id = model.id;
    userPer.isAddChild = model.allowAddChildren;
    userPer.isAddFamilyChar = model.allowAddFamilyChar;
    userPer.isAddBlogs = model.allowBlog;
    userPer.isAddNews = model.allowNews;
    
    this.loading = true;
      this.userService.updatePermission(userPer)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess("تم تعديل الصلاحيات بنجاح");  
          }, 100);
        },() => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى مراجعة الدعم الفنى");  
            this.loading = false;
          }, 100);       
          }
          ,() => {
            setTimeout(() => {          
              this.loading = false;
              this.modalService.hideModal();
            }, 100);       
                //////////////
          });
  }

  // getUserPermissions() {
  //   this.loadingClose = true;
  //   this.userService.getUserPermission(1)
  //     .subscribe(_userPermission => {
  //       this.userPermission = _userPermission;        
  //   },() => {
  //     setTimeout(() => {
  //       this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
  //       this.loadingClose = false;
  //     }, 300);       
  //     }
  //     ,() => {
  //       setTimeout(() => {
  //         this.loadingClose = false;
  //       }, 300);       
        
  //     });
  // }
}
