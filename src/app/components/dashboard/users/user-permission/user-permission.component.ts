import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ModalService } from '../../../../services/modal.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { UserPermission } from '../../../../models/userPermission';
import { Filters } from '../../../../models/filterBlogs';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  userPermission: any;
  
  userPermi: any;
  config: any  = {};
  config2: any  = {};
  loadingEdit: boolean;  
  userPerForm: FormGroup;
  loadingClose: boolean;
  userPerToUpdate: any = {};  
  loadingData: boolean;
  search_By: string = '';
  filters: Filters = new Filters();
  loadingSearch: boolean;
  loadingCancel: boolean;
  @ViewChild('txtSearch', null) searchInput: ElementRef;
  isNameChecked: boolean;
  isIdentityChecked: boolean;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService) { }

    ngOnInit() {  
      this.userPerForm = this.fb.group({
        id: [],
        isAddChild: [],
        isAddFamilyChar: [],
        isAddBlogs:  [],
        isAddNews:  []
      });

      this.route.data.subscribe(data => {
        this.userPermission = data['userPermission'];
      });


      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.userPermission.count
      };

      //this.userPerToUpdate = new UserPermission();
    }

    getUserPermissions() {
      this.loadingClose = true;
      this.userService.getUserPermission(1)
        .subscribe(_userPermission => {
          setTimeout(() => {
            this.userPermission = _userPermission;
            this.config = {
              itemsPerPage: 7,
              currentPage: 1,
              totalItems: this.userPermission.count
            };
        }, 300);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
          this.loadingClose = false;
        }, 300);       
        }
        ,() => {
          setTimeout(() => {
            this.loadingClose = false;
          }, 300);       
          
        });
    }

    saveUserPerm(id: Number){
      this.userPerToUpdate.id = id;
      return;

      this.loadingEdit = true;
      this.userService.updatePermission(this.userPermi)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.getUserPermissions();
              this.modalService.hideModal();
          }, 500);
        },() => {
          setTimeout(() => {
            this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
            this.loadingEdit = false;
            this.modalService.hideModal();
          }, 500);       
          }
          ,() => {
            setTimeout(() => {          
              this.loadingEdit = false;
              this.modalService.hideModal();
            }, 500);       
            
          });

    }

    closeModal() {
      this.getUserPermissions();
      this.modalService.hideModal();     
    }

    closeSearchModal() {
      this.modalService.hideModal();     
    }

    savePermission(model: UserPermission){
      this.loadingEdit = true;
      this.userService.updatePermission(model)
          .subscribe(() => {
            setTimeout(() => {
              this.getUserPermissions();
              this.modalService.hideModal();
              this.alertifyService.tSuccess("تم تعديل صلاحيات المستخدم بنجاح");  
          }, 100);
        },() => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى مراجعة الدعم الفنى");  
            this.loadingEdit = false;
            this.modalService.hideModal();
          }, 100);       
          }
          ,() => {
            setTimeout(() => {          
              this.loadingEdit = false;
              this.modalService.hideModal();
            }, 100);       
            //////////////
          });
    }

    showEditUserPerm(template: TemplateRef<any>, id: Number){
      this.userPermi = this.userPermission.data.find(b => b.id === id);
      this.modalService.showModal(template);
    }

    //for pageing
    getNextUserPermissions(event) {
      this.loadingData = true;
      this.config.currentPage = event;
      this.userService.getUserPermission(event)
        .subscribe(_userPermission => {
          setTimeout(() => {
            this.userPermission = _userPermission;
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
          this.loadingData = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingData = false;
          }, 100);       
          
        });
    }

    setSearchBy(event, searchBy: any){
      if ( event.target.checked ) {
        if(searchBy=='name') this.search_By = 'name';        
          else this.search_By = 'identityNum';        
      }
    }


    filterUsersPermission(search, template: TemplateRef<any>){
      debugger;
      if(search == '' || search == null){
        this.modalService.showConfirmModal(template);
        return;
      }

      this.loadingSearch = true;
      this.userService.filterUserPermission(search)
      .subscribe((_userPermission) => {
        setTimeout(() => {
          this.userPermission = _userPermission;
          // this.config = {
          //   itemsPerPage: 7,
          //   currentPage: 1,
          //   totalItems: this.userPermission.count
          // }; 
        }, 300);
      }, (err) => {
        setTimeout(() => {            
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
          this.loadingSearch = false;
        }, 300);
      }, () => {
        setTimeout(() => {         
          this.loadingSearch = false;
        }, 300);
      });

    }

    decline(){
      this.loadingCancel = true;
        this.userService.getUserPermission(1)
          .subscribe(_userPermission => {
            setTimeout(() => {
              this.userPermission = _userPermission;
              this.config = {
                itemsPerPage: 7,
                currentPage: 1,
                totalItems: this.userPermission.count
              };
          }, 300);
        },() => {
          setTimeout(() => {
            this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
            this.loadingCancel = false;
          }, 300);       
          }
          ,() => {
            setTimeout(() => {
              this.loadingCancel = false;
              this.searchInput.nativeElement.value = '';
              this.isNameChecked = false;
              this.isIdentityChecked = false;
            }, 300);       
            
          });
    }


}
