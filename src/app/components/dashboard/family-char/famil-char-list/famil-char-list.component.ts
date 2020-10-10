import { Component, OnInit, TemplateRef } from '@angular/core';
import { AlertifyService } from '../../../../services/alertify.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '../../../../services/modal.service';
import { FamilyCharactersService } from '../../../../services/family-characters.service';
import { UserService } from '../../../../services/user.service';
import { FamilyChar } from '../../../../models/familyChar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from '../../../../../environments/environment';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-famil-char-list',
  templateUrl: './famil-char-list.component.html',
  styleUrls: ['./famil-char-list.component.css']
})
export class FamilCharListComponent implements OnInit {
  familyCharacters: any;
  familyCharactersWatting: any;
  config: any = {};
  config2: any = {};
  loadingAll: boolean;
  loadingAcceptedStatus: boolean;
  loadingNotAcceptedStatus: boolean;
  loadingSearch: boolean;
  loadingDel: boolean;
  _id: number = 0;
  loading_AcceptedStatus: any;
  loading_NotAcceptedStatus: any;
  familyChar: any;
  loadingDetails: any;
  familyCharacterForEdit: any;
  loadingData: boolean;
  familyTree: any;
  loadingUserData: any;
  userData: any;
  loadingSave: boolean;
  fcDescription: string = '';
  fcTitle: string = '';
  imgUrl = environment.imageUrl + "UserImages/";
  fCharacter: any;
  loadingWattingStatus: any;
  loadingAcceptFcStatus: any;
  loadingRefusalFcStatus: any;
  fcStatus: string = "all";
  searchNow: string = "الكل";
  loadingDataComNotAccepted: any;
  ckeConfig: any;
  titleRequired: boolean;
  descriptionRequired: boolean;
  fcRequired: boolean;
  userRole: string = "";
  searchWord: string = "";
  showUserTable: boolean;
  usersData: [];
  loadingSearchUser: boolean;

  constructor(private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private familyCharactersService: FamilyCharactersService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");

    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
      //removeButtons: 'Save,NewPage,Preview,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,TextField,Textarea,Select,Button,CopyFormatting,Language,Unlink,Table,PageBreak,Maximize'
    
    
    };
    
    this.usersData = [];
    
    this.route.data.subscribe(data => {
      this.familyCharacters = data['familyChars'];
      //console.log(this.familyCharacters);
    });

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.familyCharacters.count
    };

    this.route.data.subscribe(data => {
      this.familyCharactersWatting = data['familyCharsWatting'];
      //console.log(this.familyCharactersWatting);
    });

    this.config2 = {
      id: "familyCharactersWattingId",
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.familyCharactersWatting.count
    };

    // this.route.data.subscribe(data2 => {
    //   this.familyTree = data2['treeList'];
    //   console.log(this.familyTree);
    // });

    this.getFamilyTree();

  }

  searchUser(){
    this.loadingSearchUser = true;   

    this.roleService.searchUsers(this.searchWord.trim())
      .subscribe((_users: any) => {
        setTimeout(() => {
          this.usersData = _users.data;
          if(this.usersData.length == 0)          
              this.showUserTable = false;
          else
            this.showUserTable = true;
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


  getFamilyTree() {
    this.userService.getFamilyTree()
      .subscribe((data) => {
        this.familyTree = data;
      }, (err) => {
        console.log(err);
      });
  }

  save() {
    if (this.userData == null) {
      //alert('عفوا ... اختر شخصية من شجرة العائلة');
      this.fcRequired = true;
      return;
    }
    else{
      this.fcRequired = false;
    }

    if (this.fcTitle == '' || this.fcTitle == "") {
      //alert('عفوا ... ادخل العنوان');
      this.titleRequired = true;
      return;
    }
    else{
      this.titleRequired = false;
    }

    if (this.fcDescription == '' || this.fcDescription == "") {
      //alert('عفوا ... ادخل تفاصيل الشخصية');
      this.descriptionRequired = true;
      return;
    }
    else{
      this.descriptionRequired = false;
    }    

    var fc = new FamilyChar();
    fc.charId = this.userData.id;
    fc.title = this.fcTitle;
    fc.description = this.fcDescription;

    this.loadingSave = true;
    this.familyCharactersService.save(fc)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess("تم اضافة الشخصية بنجاح");
          this.getFamilyChar();
          this.closeModal();
          this.titleRequired = false;
          this.fcRequired = false;
          this.descriptionRequired = false;
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError("عفوا.. تم اضافة الشخصية مسبقا");
          this.loadingSave = false;
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingSave = false;
            this.titleRequired = false;
            this.fcRequired = false;
            this.descriptionRequired = false;
          }, 100);

        });
  }

  getUser(userId: Number) {
    this.loadingUserData = userId;
    this.userService.getUser_ById(userId)
      .subscribe(_user => {
        setTimeout(() => {
          this.userData = _user;
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingUserData = 0;
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingUserData = 0;
          }, 100);

        });
  }

  getNextFamilyChar(event) {
    this.loadingData = true;
    this.config.currentPage = event;

    switch (this.fcStatus) {
      case "all": {
        this.familyCharactersService.getAll(event)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.familyCharacters = _blogs;
            }, 100);
          }, () => {
            setTimeout(() => {
              this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
              this.loadingData = false;
            }, 100);
          }
            , () => {
              setTimeout(() => {
                this.loadingData = false;
              }, 100);
            });
        break;
      }
      case "accept": {
        this.familyCharactersService.getFamilyCharStatus(true, event)
          .subscribe(_familyChar => {
            setTimeout(() => {
              this.familyCharacters = _familyChar;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
              this.loadingData = false;
            }, 100);
          };
        break;
      }
      case "notAccept": {
        this.familyCharactersService.getFamilyCharStatus(false, event)
          .subscribe(_familyChar => {
            setTimeout(() => {
              this.familyCharacters = _familyChar;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
              this.loadingData = false;
            }, 100);
          };
        break;
      }
      default: {
        this.familyCharactersService.getFamilyCharWattings(event)
          .subscribe(_fcWatting => {
            setTimeout(() => {
              this.familyCharacters = _fcWatting;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
              this.loadingData = false;
            }, 100);
          };
        break;
      }
    }
  }

  getFamilyChar() {
    this.familyCharactersService.getAll(1)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.familyCharacters = _blogs;
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingData = false;
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingData = false;
          }, 100);

        });
  }

  openConfirmDelete(template: TemplateRef<any>, id: number) {
    this._id = id;
    this.modalService.showConfirmModal(template);
  }

  closeModal() {
    //this.getFamilyTree();
    this.fcTitle = '';
    this.fcDescription = '';
    this.modalService.hideModal();
    this.titleRequired = false;
    this.fcRequired = false;
    this.descriptionRequired = false;
    this.userData = null;
  }

  decline(): void {
    //this.getFamilyTree();
    this.modalService.hideModal();
    this.titleRequired = false;
    this.fcRequired = false;
    this.descriptionRequired = false;
  }

  getFamilyChar_All() {
    this.loadingAll = true;
    this.config.currentPage = 1;
    this.fcStatus = "all";

    this.familyCharactersService.getAll(1)
      .subscribe(_familyChar => {
        setTimeout(() => {
          this.searchNow = "الكل";
          this.familyCharacters = _familyChar;
          this.config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: _familyChar.count
          };
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingAll = false;
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingAll = false;
          }, 100);
        });
  }

  fcUpdated() {
    this.getFamilyCharAll();
    this.getFamilyChar_Watting();
  }


  getFamilyCharAll() {
    this.config.currentPage = 1;
    this.familyCharactersService.getAll(1)
      .subscribe(_familyChar => {
        this.familyCharacters = _familyChar;
        this.config = {
          itemsPerPage: 7,
          currentPage: 1,
          totalItems: _familyChar.count
        };
      }, () => { this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى '); }
      );
  }

  getFamilyChar_Watting() {
    //this.loadingWattingStatus = true;
    this.familyCharactersService.getFamilyCharWattings(1)
      .subscribe(_fcWatting => {
        setTimeout(() => {
          this.familyCharactersWatting = _fcWatting;
          //this.loadingWattingStatus = false;
          this.config2 = {
            id: "familyCharactersWattingId",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.familyCharactersWatting.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          //this.loadingWattingStatus = false;
        }, 100);
      };
  }

  getFamilyChar_Accepted(status: boolean) {
    this.loadingAcceptedStatus = true;
    this.fcStatus = "accept";

    this.familyCharactersService.getFamilyCharStatus(status, 1)
      .subscribe(_familyChar => {
        setTimeout(() => {
          this.searchNow = "تم الموافقة";
          this.familyCharacters = _familyChar;
          this.loadingAcceptedStatus = false;
          this.config = {
            itemsPerPage: 7,
            currentPage: 1,
            totalItems: _familyChar.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingAcceptedStatus = false;
        }, 100);
      };
  }

  getFamilyChar_NotAccepted(status: boolean) {
    this.loadingNotAcceptedStatus = true;
    this.fcStatus = "notAccept";

    this.familyCharactersService.getFamilyCharStatus(status, 1)
      .subscribe(_familyChar => {
        setTimeout(() => {
          this.searchNow = "مرفوضة";
          this.familyCharacters = _familyChar;
          this.loadingNotAcceptedStatus = false;
          this.config = {
            itemsPerPage: 7,
            currentPage: 1,
            totalItems: _familyChar.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingNotAcceptedStatus = false;
        }, 100);
      };
  }

  getFamilyChar_Wattings() {
    this.loadingWattingStatus = true;
    this.fcStatus = "watting";

    this.familyCharactersService.getFamilyCharWattings(1)
      .subscribe(_fcWatting => {
        setTimeout(() => {
          this.searchNow = "قيد الانتظار";
          this.familyCharacters = _fcWatting;
          this.loadingWattingStatus = false;
          this.config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.familyCharacters.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingWattingStatus = false;
        }, 100);
      };
  } 

  filterFamilyChar(value: string, template: TemplateRef<any>) {
    this.loadingSearch = true;
    let valueToSreach = value.toLowerCase();
    if (valueToSreach == "" || valueToSreach == null) {
      this.modalService.showConfirmModal(template);
      this.loadingSearch = false;
    }
    else {
      this.familyCharactersService.filterFamilyChar(valueToSreach)
        .subscribe(_familyChar => {
          setTimeout(() => {
            this.familyCharacters = _familyChar;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: _familyChar.count
            };
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
            this.loadingSearch = false;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingSearch = false;
            }, 100);
          });

    }
  }

  delete() {
    this.loadingDel = true;
    this.familyCharactersService.delete(this._id)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess('تم حذف الشخصية بنجاح');
          this.getFamilyCharAll();
        }, 100);
      }, error => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingDel = false;
          this.modalService.hideModal();
        }, 100);
      }, () => {
        setTimeout(() => {
          this.loadingDel = false;
          this.modalService.hideModal();
        }, 100);
      });
  }

  setAcceptStatus(id: Number, status: boolean) {
    this.loading_AcceptedStatus = id;
    this.familyCharactersService.setAcceptStatus(status, id)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess('تم قبول الشخصية');
          this.getFamilyCharAll();
          this.loading_AcceptedStatus = 0;
        }, 100);
      }), () => {
        this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
        this.loading_AcceptedStatus = false;
      };
  }

  setNotAcceptStatus(id: Number, status: boolean) {
    this.loading_NotAcceptedStatus = id;
    this.familyCharactersService.setAcceptStatus(status, id)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess('تم رفض الشخصية');
          this.getFamilyCharAll();
          this.loading_NotAcceptedStatus = 0;
        }, 100);
      }), () => {
        this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
        this.loading_NotAcceptedStatus = false;
      };
  }

  getDetails(template: TemplateRef<any>, id: Number) {
    this.familyChar = this.familyCharacters.data.find(b => b.id == id);
    this.modalService.showModal(template);

    // this.loadingDetails =  id;
    // this.familyCharactersService.get(id)
    //   .subscribe((_familyChar) => {
    //     setTimeout(() => {
    //       this.modalService.showModal(template);
    //       this.familyChar = _familyChar;
    //       this.loadingDetails = 0;
    //     }, 100);
    //     }, () => {
    //       setTimeout(() => {
    //         this.alertifyService.error(' خطأ فى العملية... يرجى مراجعة الدعم الفنى ');
    //         this.loadingDetails = 0;
    //       }, 100);
    //     });  
  }

  getForEdit(template: TemplateRef<any>, id: Number) {
    this.familyCharactersService.get(id)
      .subscribe((fc) => {
        this.familyCharacterForEdit = fc;
        this.modalService.showModal(template);
      }, () => {
        this.alertifyService.tError('خطأ فى تحميل البيانات');
      });
  }
 
  showAdd(template: TemplateRef<any>) {
    this.modalService.showModal(template);
    this.showUserTable = false;
    this.searchWord = "";
  }

  openFcDetails(template: TemplateRef<any>, fcId: Number) {
    this.fCharacter = this.familyCharactersWatting.data.find(b => b.id == fcId);
    this.modalService.showModal(template);
  }

  acceptFamilyCharStatus(fcId: Number, status: boolean) {
    this.loadingAcceptFcStatus = fcId;
    this.familyCharactersService.updateFamilyCharStatus(fcId, status)
      .subscribe((result) => {
        setTimeout(() => {
          this.getFamilyChar_All();
          this.getFamilyChar_Watting();
          this.loadingAcceptFcStatus = 0;
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingAcceptFcStatus = 0;
        }, 100);
      };

  }

  refuseFamilyCharStatus(fcId: Number, status: boolean) {
    this.loadingRefusalFcStatus = fcId;
    this.familyCharactersService.updateFamilyCharStatus(fcId, status)
      .subscribe((result) => {
        setTimeout(() => {
          this.getFamilyChar_All();
          this.getFamilyChar_Watting();
          this.loadingRefusalFcStatus = 0;
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingRefusalFcStatus = 0;
        }, 100);
      };

  }

  getNextFcNotAccept(event){
    this.loadingDataComNotAccepted = true;
    this.config2.currentPage = event;

    this.familyCharactersService.getFamilyCharWattings(event)
      .subscribe(_fcWatting => {
        setTimeout(() => {
          this.familyCharactersWatting = _fcWatting;
          this.loadingDataComNotAccepted = false;
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى المحاولة مرة اخرى ');
          this.loadingDataComNotAccepted = false;
        }, 100);
      };
  }
}
