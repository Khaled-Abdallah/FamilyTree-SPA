import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import {TreeNode} from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { ModalService } from 'src/app/services/modal.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {
  familyTree: any;
  imgUrl = environment.imageUrl + "UserImages/";
  data: TreeNode[];
  _parentId: Number = 0;
  userData: any;
  userId: Number = 0;
  showUserProfile: Boolean = false;
  showTree: boolean;

  depthLimit = 4;
  treeId="ftree";
  width=window.innerWidth;
  height=window.innerHeight;
  vertical=true; //if false tree will be hidden
  res=null;
  searchText = "";
  treeData: any;
  fatherData: any;
  

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService,
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService) {
      this.route.data.subscribe(data => {
        this.familyTree = data['treeList'];
      });
      if(this.familyTree.length > 0)
        {
          this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);
        }
     }

  ngOnInit() {
    this.showTree = true;
    this.route.data.subscribe(data => {
      this.familyTree = data['treeList'];
    });
  }
  
  showUserDetails(node: any){  
    this.userId = node.data.id;

    this.showUserProfile = true;
    this.showTree = false;
    
    this.spinner.show();
    this._parentId = node.data.id;
    this.userService.getUserInfoForMob(node.data.id)
        .subscribe(_userData => {
          setTimeout(() => {
            this.userData = _userData;
            console.log(this.userData);
          }, 50);  
        },() => {
          setTimeout(() => {          
            this.spinner.hide();
          }, 50);       
        }
        ,() => {
            setTimeout(() => {          
              this.spinner.hide();     
            }, 50);                   
        });
  }

  //get father data by current user
  getFatherData(ParentId: Number) {
    this.userService.getFatherData(ParentId)
      .subscribe(_fatherData => {
        setTimeout(() => {
          this.fatherData = _fatherData;
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى  المحاولة مرة اخرى");  
      }, 100);       
      });
  }

  returnToFamilyTree(){
    this.userService.getFamilyTreeForMobile()
    .subscribe(_data => {
      setTimeout(() => {
        this.familyTree = _data;
    }, 50);
  },() => {
    setTimeout(() => {      
    }, 50);       
    });


    // this.userService.getFamilyTreeForMobile().pipe(
    //   catchError(error => {
    //     this.alertify.error('خطأ اثناء تحميل البيانات');        
    //     this.authService.logout();
    //       return of(null);
    //   })

    // this.route.data.subscribe(data => {
    //   this.familyTree = data['treeList'];
    // });

    debugger
    if(this.familyTree.length > 0)
    {
      this.treeData = this.limitTreeDepth(this.copyObj(this.familyTree[0]),this.depthLimit);

      this.showUserProfile = false;
      this.showTree = true;
    }

  

   
  }

  //===================================================================================

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



}
