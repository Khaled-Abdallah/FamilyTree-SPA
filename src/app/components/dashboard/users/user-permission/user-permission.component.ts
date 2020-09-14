import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ModalService } from '../../../../services/modal.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { UserPermission } from '../../../../models/userPermission';
import { Filters } from '../../../../models/filterBlogs';
import { RoleService } from 'src/app/services/role.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { UserRole } from 'src/app/models/userRole';
import { Numeric } from 'd3';
import { AddUserRole } from 'src/app/models/addUerRole';

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
  addSuperAdminForm: FormGroup;
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
  roles: any[];
  loadingRoles: boolean;
  roleName: string= "";
  _roleId: Number = 0;
  roleName4Add: string= "";
  showUserRoles: boolean;
  loadingUserRoles: boolean;
  usersRoles: any;
  loadingSuperAdmin: boolean;
  loadingDeleteUserRole: any;
  userId: Number;
  userMail: Number;
  loadingDelete: boolean;
  roleNameEn: any;
  searchWord: string = "";
  usersData: [];
  loadingSearchUser: boolean;
  loadingAddUser: any;
  
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private roleService: RoleService) { }

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

      this.addSuperAdminForm = this.fb.group({
        // id: [0],
        fullName: [, [Validators.required]],
        userName: [, [Validators.required]],
        password: [, [Validators.required, Validators.minLength(6), , Validators.maxLength(20)]],
        email: [, [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        phoneNumber: [, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
      });

      this.getRoles();
    }

    checkMobilNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
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
        }, 100);
      }, (err) => {
        setTimeout(() => {            
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
          this.loadingSearch = false;
        }, 100);
      }, () => {
        setTimeout(() => {         
          this.loadingSearch = false;
        }, 100);
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

    //==========================================    
    getRoles(){
      this.loadingRoles = true;
      this.roleService.getRoles()
      .subscribe((_roles: any[]) => {
        setTimeout(() => {
          this.roles = _roles;
          this._roleId = this.roles[0].id;
          this.roleName4Add = this.roles[0].nameAr;
          this.roleNameEn = this.roles[0].nameEn;          
          this.getUserRole(this._roleId,this.roleName4Add ,this.roleNameEn);
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
        this.loadingRoles = false;
      }, 100);       
      }
      ,() => {
        setTimeout(() => {          
          this.loadingRoles = false;
        }, 100);       
        
      });
    }

    getUserRole(roleId: Number, _roleName: any, roleNameEn){
      this.loadingUserRoles = true;

      this.roleName4Add = _roleName;
      this.roleNameEn = roleNameEn;
      this._roleId = roleId;

      this.roleService.getUsersRole(roleId)
        .subscribe(_usersRoles => {
          setTimeout(() => {
            this.usersRoles = _usersRoles;
            this.loadingUserRoles = false;

            this.showUserRoles = true;
            this.roleName = _roleName;
            
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
          this.loadingUserRoles = false;
        }, 100);
        }
        ,() => {
          setTimeout(() => {          
            this.loadingUserRoles = false;
          }, 100);                 
        });
    }

    getUsersByRoleId(roleId: Number){
      debugger;
      this.roleService.getUsersRole(roleId)
        .subscribe(_usersRoles => {
            this.usersRoles = _usersRoles;            
            console.log(this.usersRoles);
      });
    }

    showAddSuperAdmin(template: TemplateRef<any>){     
      this.modalService.showModalMd(template);
    }  

    onAddSuperAdmin(model: UserRole) {
      this.loadingSuperAdmin = true;
      model.roleId = this._roleId;

      this.roleService.addSuperAdmin(model)
        .subscribe(() => {
          setTimeout(() => {        
            this.alertifyService.tSuccess('تم الحفظ بنجاح');
            this.closeModal();
            this.getUserRole(this._roleId, this.roleName, this.roleNameEn);
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError('خطأ فى عملية الحفظ ... يرجي المحاولة مرة اخرى ');
            this.loadingSuperAdmin = false;
          }, 100);
        }, () => {
          //////////
          this.loadingSuperAdmin = false;
        });
    }

    openConfirmDelete(email: any, template: TemplateRef<any>) {
      this.userMail = email;
      this.modalService.showConfirmModal(template);
    }

    deleteUserRole(){
      this.loadingDelete = true;
      this.roleService.deleteUserRole(this.userMail)
      .subscribe(() => {
        setTimeout(() => {        
          this.alertifyService.tSuccess('تم الحذف بنجاح');
          this.getUserRole(this._roleId, this.roleName,this.roleNameEn);
          this.loadingDelete = false;
          this.closeModal();
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية الحفظ ... يرجي المحاولة مرة اخرى ');
          this.loadingDelete = false;
        }, 100);
      }, () => {
        //////////
        this.loadingDelete = false;
      });
    }

    //==============================
    
    showAddAdmin(template: TemplateRef<any>){
      this.modalService.showModal(template);
      this.usersData = [];
      this.searchWord = "";
    }  

    searchUser(){
      this.loadingSearchUser = true;

      this.roleService.searchUsers(this.searchWord.trim())
        .subscribe((_users: any) => {
          setTimeout(() => {
            this.usersData = _users.data;
          }, 100);
        }, (err) => {
          setTimeout(() => {            
            this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
            this.loadingSearchUser = false;
          }, 100);
        }, () => {
          setTimeout(() => {         
            this.loadingSearchUser = false;
          }, 100);
        });
    }

    addUerToRole(userId: Number){
      this.loadingAddUser = userId;
      var userRole = new AddUserRole();
      userRole.userId = userId;
      userRole.roleId = this._roleId;

      this.roleService.addUerToRole(userRole)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم إضافة المستخدم الى المجموعة');
            this.modalService.hideModal();
            this.getUsersByRoleId(userRole.roleId);
          }, 100);
        }, (err) => {
          setTimeout(() => {
            debugger;
            if(err.error.status == "foundInSameRole"){
              this.alertifyService.tError('عفوا ... المستخدم موجود فى نفس المجموعة');
            }
            if(err.error.status == "foundAnotherRole"){
              this.alertifyService.tError('عفوا ... المستخدم موجود فى مجموعة اخرى');
            }

            //this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى');
            this.loadingAddUser = 0;
          }, 100);
        }, () => {
          setTimeout(() => {         
            this.loadingAddUser = 0;
          }, 100);
        });
    }

  }

