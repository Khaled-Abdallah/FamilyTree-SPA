import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { ModalService } from '../../../../services/modal.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  users: any;
  configUsers: any = {};
  loadingUsersData: boolean;
  loading_AcceptedStatus: any;
  loadingAll: any;
  loadingAccepted: any;
  loadingNotAccepted: any;
  loadingSearch: any;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
    });

    this.configUsers = {
      id: 'paginationUsers',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.users.count
    };
  }

  getNextUser(event) {
    //this.spinner.show();
    this.loadingUsersData = true;
    this.configUsers.currentPage = event;

    this.userService.getUsers(event)
      .subscribe(_users => {
        setTimeout(() => {
          this.users = _users;
        }, 300);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingUsersData = false;
          //this.spinner.hide();
        }, 300);
      }
        , () => {
          setTimeout(() => {
            this.loadingUsersData = false;
            //this.spinner.hide();
          }, 300);
        });
  }

  updateUserStatus(userId: Number, status: boolean) {
    this.loading_AcceptedStatus = userId;
    this.userService.updateUserStatus(userId, status)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess('تم الحفظ بنجاح');
          this.getUsers();
          this.loading_AcceptedStatus = 0;
        }, 300);
      }),
      () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى مراجعة الدعم الفنى ');
        }, 300);
      }, () => {
        setTimeout(() => {
          this.loading_AcceptedStatus = 0;
        }, 100);
      };
  }

  getUsers() {
    this.userService.getUsers(1)
      .subscribe(_users => {
        this.users = _users;
      }, () => {
        this.alertifyService.tError("خطأ فى تحميل البيانات يرجى مراجعة الدعم الفنى");
      });
  }

  getUserStatus(status: any) {
    debugger
    if (status == 'all') {
      this.loadingAll = true;
      setTimeout(() => {
        this.getUsers();
        this.loadingAll = false;
      }, 300);

    }
    else if (status == 'true') {
      this.loadingAccepted = true;
      this.userService.getUsersStatus(true)
        .subscribe((users) => {
          setTimeout(() => {
            this.users = users;
            this.loadingAccepted = false;
          }, 300);
        }),
        () => {
          setTimeout(() => {
            this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى مراجعة الدعم الفنى ');
          }, 300);
        }, () => {
          setTimeout(() => {
            this.loadingAccepted = false;
          }, 100);
        };
    }
    else {
      this.loadingNotAccepted = true;
      this.userService.getUsersStatus(false)
        .subscribe((users) => {
          setTimeout(() => {
            this.users = users;
            this.loadingNotAccepted = false;
          }, 300);
        }),
        () => {
          setTimeout(() => {
            this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى مراجعة الدعم الفنى ');
          }, 300);
        }, () => {
          setTimeout(() => {
            this.loadingNotAccepted = false;
          }, 100);
        };
    }
  }

  filterUsers(search: any, template: TemplateRef<any>){
    if(search == '' || search == null){
      this.modalService.showConfirmModal(template);
      return;
    }

    this.loadingSearch = true;
      this.userService.filterUsers(search)
        .subscribe((users) => {
          setTimeout(() => {
            this.users = users;
            this.loadingSearch = false;
          }, 300);
        }),
        () => {
          setTimeout(() => {
            this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى مراجعة الدعم الفنى ');
          }, 300);
        }, () => {
          setTimeout(() => {
            this.loadingSearch = false;
          }, 100);
        };
  }

  closeModal() { 
    this.modalService.hideModal();    
  }

}
