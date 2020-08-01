import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { AlertifyService } from '../../../../services/alertify.service';
import { ModalService } from '../../../../services/modal.service';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadService } from '../../../../services/file-upload.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
//declare var $ : any;
//import fs = require('fs');

import * as d3 from 'd3';
import { I18nSelectPipe } from '@angular/common';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'family-tree-list',
  templateUrl: './family-tree-list.component.html',
  styleUrls: ['./family-tree-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FamilyTreeListComponent implements OnInit {
  options:any;
  files: any;
  nodes: any;
  familyTree = [
        {
            "id": 1,
            "name": "مدير التطبيق",
            "identityNum": "H-031044",
            "userImage": null,
            "gender": 1,
            "status": 2,
            "children": [
                {
                    "id": 2,
                    "name": "ثويني",
                    "identityNum": "H-031045",
                    "userImage": null,
                    "gender": 1,
                    "status": 1,
                    "children": [
                        {
                            "id": 3,
                            "name": "ثنيان",
                            "identityNum": "H-031046",
                            "userImage": null,
                            "gender": 1,
                            "status": 1,
                            "children": [
                                {
                                    "id": 4,
                                    "name": "محمد",
                                    "identityNum": "H-031047",
                                    "userImage": null,
                                    "gender": 1,
                                    "status": 1,
                                    "children": [
                                        {
                                            "id": 5,
                                            "name": "عبدالرحمن",
                                            "identityNum": "H-031048",
                                            "userImage": null,
                                            "gender": 1,
                                            "status": 1,
                                            "children": [
                                                {
                                                    "id": 6,
                                                    "name": "عبدالله1",
                                                    "identityNum": "H-031049",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 7,
                                                    "name": "محمد",
                                                    "identityNum": "H-031050",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 8,
                                                    "name": "ثنيان",
                                                    "identityNum": "H-031051",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 9,
                                                    "name": "صالح",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 10,
                                                    "name": "عبدالله2",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 11,
                                                    "name": "سلمى",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 2,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 12,
                                                    "name": "ابراهيم",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 13,
                                                    "name": "عبدالعزيز",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                },
                                                {
                                                    "id": 14,
                                                    "name": "فهد",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "id": 15,
                                            "name": "عبدالله",
                                            "identityNum": "H-031044",
                                            "userImage": null,
                                            "gender": 1,
                                            "status": 1,
                                            "children": []
                                        },
                                        {
                                            "id": 19,
                                            "name": "خالد",
                                            "identityNum": "H-031044",
                                            "userImage": null,
                                            "gender": 1,
                                            "status": 1,
                                            "children": [
                                                {
                                                    "id": 21,
                                                    "name": "ابن خالد",
                                                    "identityNum": "H-031044",
                                                    "userImage": null,
                                                    "gender": 1,
                                                    "status": 1,
                                                    "children": [
                                                        {
                                                            "id": 22,
                                                            "name": "ابن ابن خالد",
                                                            "identityNum": "H-031044",
                                                            "userImage": null,
                                                            "gender": 1,
                                                            "status": 1,
                                                            "children": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": 17,
                                    "name": "صالح",
                                    "identityNum": "H-031044",
                                    "userImage": null,
                                    "gender": 1,
                                    "status": 1,
                                    "children": []
                                },
                                {
                                    "id": 18,
                                    "name": "عبدالله",
                                    "identityNum": "H-031044",
                                    "userImage": null,
                                    "gender": 1,
                                    "status": 1,
                                    "children": []
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 24,
                    "name": "خالد عبدالله",
                    "identityNum": "H-279588",
                    "userImage": null,
                    "gender": 1,
                    "status": 1,
                    "children": []
                },
                {
                    "id": 25,
                    "name": "adadad",
                    "identityNum": "H-473163",
                    "userImage": null,
                    "gender": 2,
                    "status": 1,
                    "children": []
                },
                {
                    "id": 26,
                    "name": "ererere",
                    "identityNum": "H-890926",
                    "userImage": null,
                    "gender": 2,
                    "status": 1,
                    "children": []
                },
                {
                    "id": 27,
                    "name": "qqqq",
                    "identityNum": "H-147698",
                    "userImage": "04c082c0-f52b-4242-b9a1-a2d510c2ce57.jpg",
                    "gender": 2,
                    "status": 1,
                    "children": []
                },
                {
                    "id": 28,
                    "name": "صثصثص",
                    "identityNum": "T-333339",
                    "userImage": "e5d7aa89-78c7-4b0c-aa76-0aa626ab2e5d.jpg",
                    "gender": 1,
                    "status": 1,
                    "children": []
                }
            ]
        }
    ];
  userData: any;
  fatherData: any;
  loadingUserData: any;
  userForm: FormGroup;
  imgUrl = environment.imageUrl + "UserImages/";
  loadingSearch: any;
  users: any;
  configUsers: any = {};
  user: any;
  loadingUsersPaging: boolean;
  loadingAcceptedUser: boolean;
  loadingUserSearch : boolean;
  loadingNewsSearch: boolean;
  searchWord: string = "";
  showUserDetails: boolean = false;
  showFamilyTree: boolean = true;
  userId: Number = 0;
  
  loadingImage: boolean;
  imgToUpload: File = null;
  imageName: string = "";
  imagePath: string = "../../../assets/users/user.png";
  bsConfig: Partial<BsDatepickerConfig>;
  birthDateH: any;
  genderTypes: any;
  wifes: any;
  loading: any;
  family: any;
  status: any;
  loadingDateH: boolean;
  treeTitle: string = "";

  depthLimit = 4;
  treeId="ftree";
  treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
  width=window.innerWidth;
  height=window.innerHeight;
  vertical=true; //if false tree will be hidden
  res=null;
  searchText = "";

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService) 
    { }

  
  //click event handle with clicked node data injected.
  nodeClick(nodeData) {
    console.log(nodeData.data);
  };

  emptyData(){
    this.treeData = { id: -1, name: "", identityNum: "", userImage: "", gender: -1, status: -1, children: []};
  }

  copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  limitTreeDepth(tree, depthLimit,depth=0){
    if(depth == depthLimit-1) {
      tree.children = [];
    }
    let newTree = this.copyObj(tree);
    let hasChildren = [];
    newTree.children = [];
    for(let i = 0; i < tree.children.length; i++){
      if(tree.children[i].children){
        hasChildren.push(tree.children[i]);
      } else {
        newTree.children.push(tree.children[i]);
      }
    }
    depth+=1;
    hasChildren.forEach((subTree)=>{
      newTree.children.push(this.limitTreeDepth(subTree,depthLimit,depth));
    });
    return newTree;
  }

  showMore(numLevels){
    this.depthLimit += numLevels;
    this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
    if(this.searchText != ""){
      this.find(this.searchText);
    }
  }

  findNode(object, nodeId) {
    if(this.res) {
      this.res.found=false;
      this.res = null;
    }
    //search by desired parameter by changing the below line
    if (object.identityNum === nodeId) return object;
 
    var result;
    for (var i = 0; i < object.children.length; i++) {
       result = this.findNode(object.children[i], nodeId);
       if (result !== undefined) return result;
    }
  }

  find(text){
    this.searchText = text;
    if(text == ""){
      this.res.found = false
    } else {
      this.res = this.findNode(this.treeData, text);
      if(this.res){
        this.res["found"] = true;
      } 
    }
  }
  //=================================================================
  ngOnInit() {
    this.route.data.subscribe(data => {
      //this.familyTree = data['treeList'];
      //console.log(this.familyTree);
    });

    this.route.data.subscribe(data => {
      this.users = data['usersNotAccepted'];
    });

    this.configUsers = {
      id: 'paginationUsers',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.users.count
    };
       
    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'YYYY/MM/DD' ,
      isAnimated: true
    };
  }
  
  getUserData(node){
    this.spinner.show();
    this.userService.getUserInfo(node.id)
        .subscribe(_userData => {
          this.userData = _userData;
          this.treeTitle = "- تفاصيل الشخصية";
          this.showUserDetails = true;
          this.showFamilyTree = false;  
        },() => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
            this.spinner.hide();
          }, 100);       
        }
        ,() => {
            setTimeout(() => {          
              this.spinner.hide();     
            }, 100);                   
        });
  }

  getNext(pageNo: Number) {
    
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

  uploadImage(file: FileList){
    
    this.loadingImage = true;    
    this.imgToUpload = file.item(0);

    // var reader = new FileReader();
    // reader.onload = (event:any) => {
    //   this.imagePath = event.target.result;
    // }
    // reader.readAsDataURL(this.imgToUpload);
    // return;

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

  returnToFamilyTree(){
    this.showUserDetails = false;
    this.showFamilyTree = true;
    this.userId = 0;
    this.treeTitle = "";
  }

   //for pageing
   getNextUser(event) {
    this.loadingUsersPaging = true;
    this.configUsers.currentPage = event;
    this.userService.getUsersNotAccepted(event)
      .subscribe(_users => {
        setTimeout(() => {
          this.users = _users;
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
        this.loadingUsersPaging = false;
      }, 100);       
      }
      ,() => {
        setTimeout(() => {          
          this.loadingUsersPaging = false;
        }, 100);       
        
      });
  }

  acceptUser(id: Number, userMail: string, IDn: string) {
    this.loadingAcceptedUser = true;
    this.userService.acceptUserAdd(id, userMail, IDn)
      .subscribe(_users => {
        setTimeout(() => {
          this.users = _users;
          this.closeModal();
          this.alertifyService.tSuccess("تم  الموافقة وارسال الرقم التعريفى بنجاح");  
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("حدث خطأ ما ... يرجى التأكد من الاتصال بخدمة الانترنت او التأكد من اعدادات  بريد الارسال");  
        this.loadingAcceptedUser = false;
      }, 100);       
      }
      ,() => {
        setTimeout(() => {          
          this.loadingAcceptedUser = false;
        }, 100);       
        
      });
  }  

  showDetails(template: TemplateRef<any>, userId: Number, ParentId: Number){
    debugger
    this.user = this.users.data.find(u => u.id == userId);
    this.getFatherData(ParentId);
    // if(this.fatherData == null){
    //   this.alertifyService.error("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
    //   return;
    // }
    this.modalService.showModal(template);
  }

  closeModal() {
    this.modalService.hideModal();    
  }

  getFatherData(ParentId: Number) {
    this.userService.getFatherData(ParentId)
      .subscribe(_fatherData => {
        setTimeout(() => {
          this.fatherData = _fatherData;
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
        this.loadingUserData = 0;
      }, 100);       
      });
  }

  // getUser(node: any) {
  //   this.loadingUserData = node.data.id;    
  //   this.userService.getUserById(node.data.id)
  //     .subscribe(_user => {
  //       setTimeout(() => {
  //         this.userData = _user;
  //     }, 100);
  //   },() => {
  //     setTimeout(() => {
  //       this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");  
  //       this.loadingUserData = 0;
  //     }, 100);       
  //     }
  //     ,() => {
  //       setTimeout(() => {          
  //         this.loadingUserData = 0;
  //       }, 100);       
        
  //     });
  // }

  getFamilyTree() {
    this.userService.getFamilyTree()
      .subscribe((data) => {
          this.familyTree = data;
      }, (err) => {
        //console.log(err);
      });
  }

  filterUserNotAccepted(template: TemplateRef<any>){
    if(this.searchWord == ""){
      alert("أدخل كلمات بحثية!");
      return;
    }

    this.loadingUserSearch = true;
      this.userService.filterUserNotAccepted(this.searchWord)
      .subscribe(_users => {
        setTimeout(() => {
          this.users = _users;
          this.configUsers = {
            id: 'paginationUsers',
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.users.count
          };
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");  
        this.loadingUserSearch = false;
      }, 100);       
      }
      ,() => {
        setTimeout(() => {          
          this.loadingUserSearch = false;
        }, 100);       
        
      });
    
  }

  clearSearch(){
    this.loadingNewsSearch = true;
    this.userService.getUsersNotAccepted(1)
      .subscribe(_users => {
        setTimeout(() => {
          this.users = _users;
          this.searchWord = "";
          this.configUsers = {
            id: 'paginationUsers',
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.users.count
          };
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
        this.loadingNewsSearch = false;
      }, 100);       
      }
      ,() => {
        setTimeout(() => {          
          this.loadingNewsSearch = false;
        }, 100);       
        
      });
    
  }

}
