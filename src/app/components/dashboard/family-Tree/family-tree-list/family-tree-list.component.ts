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
  familyTree : any;
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
  _parentId: Number = 0;
  userRole: string = "";

  depthLimit = 20;
  treeId="ftree";
  width=window.innerWidth;
  height=window.innerHeight;
  vertical=true; //if false tree will be hidden
  res=null;
  searchText = "";
  treeData: any;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService) 
    { 
      this.route.data.subscribe(data => {
        this.familyTree = data['treeList'];
      });
      debugger
      if(this.familyTree.length > 0)
        {
          this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
        }
    }
  
    nodeClick(nodeData) { //click event handle with clicked node data injected.
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
  
    findNode(object, name, parentName="", grandParentName="") {
      if(this.res) {
        this.res.found=false;
        this.res = null;
      }
      if(!object.parentName) object.parentName="";
      if(!object.grandParentName) object.grandParentName="";
      //search by desired parameter by changing the below line
      if (object.name === name && object.parentName === parentName && object.grandParentName === grandParentName){
        return object;
      }
      var result;
      for (var i = 0; i < object.children.length; i++) {
          object.children[i].grandParentName = object.parentName || "";
          object.children[i].parentName = object.name;
         result = this.findNode(object.children[i], name, parentName, grandParentName);
         if (result !== undefined) return result;
      }
    }
  
    find(text){
      text = text.split(" ",3);
      this.searchText = text;
      if(text.length <= 1){
        this.res.found = false
      } else if(text.length == 3) {
        this.res = this.findNode(this.treeData, text[0],text[1],text[2]);
        if(this.res){
          this.res["found"] = true;
        } 
      }
    }

    
  //======================================================================================
  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    
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
  
  // getUserData(node){
  //   this.spinner.show();
  //   this.userService.getUserInfo(node.id)
  //       .subscribe(_userData => {
  //         this.userData = _userData;
  //         console.log(this.userData);
  //         this.treeTitle = "- تفاصيل الشخصية";
  //         this.showUserDetails = true;
  //         this.showFamilyTree = false;  
  //       },() => {
  //         setTimeout(() => {
  //           this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
  //           this.spinner.hide();
  //         }, 100);       
  //       }
  //       ,() => {
  //           setTimeout(() => {          
  //             this.spinner.hide();     
  //           }, 100);                   
  //       });
  // }


  getUserUpdated(data){
    console.log(this._parentId);
    this.userService.getUserInfo(this._parentId)
        .subscribe(_userData => {
          setTimeout(() => {
            this.userData = _userData;
          }, 50);  
        },() => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
          }, 50);       
        }
        ,() => {
            setTimeout(() => {          
            }, 50);                   
        });
  }

  _showUserDetails(node: any){

    this.spinner.show();
    this._parentId = node.data.id;
    this.userService.getUserInfo(node.data.id)
        .subscribe(_userData => {
          setTimeout(() => {
            this.userData = _userData;
            console.log(this.userData);
            console.log(this.userData.userInfo.genderId);

            this.treeTitle = "- التفاصيل";
            this.showUserDetails = true;
            this.showFamilyTree = false;  
          }, 50);  
        },() => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
            this.spinner.hide();
          }, 50);       
        }
        ,() => {
            setTimeout(() => {          
              this.spinner.hide();     
            }, 50);                   
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
    // this.spinner.show();

    // this.showUserDetails = false;
    // this.showFamilyTree = true;
    // this.userId = 0;
    // this.treeTitle = "";

    // this.userService.getFamilyTreeForMobile()
    //   .subscribe(_users => {
    //     setTimeout(() => {
    //       this.familyTree = _users;
    //       this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
    //       this.spinner.hide();     
    //     }, 1000); 
    // },() => {
    //   setTimeout(() => {
    //     this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
    //     this.spinner.hide();
    //   }, 1000);       
    // }
    // ,() => {
    //     setTimeout(() => {          
    //       this.spinner.hide();     
    //     }, 1000);                   
    // });

    this.showUserDetails = false;
    this.showFamilyTree = true;
    this.userId = 0;
    this.treeTitle = "";

    this.userService.getFamilyTreeForMobile()
      .subscribe(_users => {
        this.familyTree = _users;
        this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
    },() => {
        //error
    });

  }

  ftChanged(){
    this.showUserDetails = false;
    this.showFamilyTree = true;
    this.userId = 0;
    this.treeTitle = "";

    this.userService.getFamilyTreeForMobile()
      .subscribe(_users => {
        this.familyTree = _users;
        this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
    },() => {
        //error
    });
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
