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

  depthLimit = 4;
  treeId="ftree";
  width=window.innerWidth;
  height=window.innerHeight;
  vertical=true; //if false tree will be hidden
  res=null;
  searchText = "";
  treeData: any;

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

  //   this.familyTree = [
  //     {
  //         "id": 1,
  //         "name": "admin1",
  //         "userImage": "b255b74e-36e0-4f54-9d2a-7a080175e217.jpg",
  //         "children": [
  //             {
  //                 "id": 2,
  //                 "name": "the",
  //                 "userImage": null,
  //                 "children": [
  //                     {
  //                         "id": 3,
  //                         "name": "sdsds",
  //                         "userImage": null,
  //                         "children": [
  //                             {
  //                                 "id": 4,
  //                                 "name": "qweqw",
  //                                 "userImage": null,
  //                                 "children": [
  //                                     {
  //                                         "id": 5,
  //                                         "name": "sddscxv",
  //                                         "userImage": null,
  //                                         "children": [
  //                                             {
  //                                                 "id": 6,
  //                                                 "name": "223ssaa",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 7,
  //                                                 "name": "2wsdsd",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 8,
  //                                                 "name": "bnnv",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 9,
  //                                                 "name": "iooio",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 10,
  //                                                 "name": "ghjgh",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 11,
  //                                                 "name": "ghjghjg",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             },
  //                                             {
  //                                                 "id": 12,
  //                                                 "name": "test",
  //                                                 "userImage": null,
  //                                                 "children": []
  //                                             }
  //                                         ]
  //                                     },
  //                                     {
  //                                         "id": 15,
  //                                         "name": "popop",
  //                                         "userImage": null,
  //                                         "children": []
  //                                     },
  //                                     {
  //                                         "id": 19,
  //                                         "name": "erere",
  //                                         "userImage": null,
  //                                         "children": [
  //                                             {
  //                                                 "id": 21,
  //                                                 "name": "adad asd",
  //                                                 "userImage": null,
  //                                                 "children": [
  //                                                     {
  //                                                         "id": 22,
  //                                                         "name": "asf",
  //                                                         "userImage": null,
  //                                                         "children": []
  //                                                     }
  //                                                 ]
  //                                             }
  //                                         ]
  //                                     }
  //                                 ]
  //                             },
  //                             {
  //                                 "id": 17,
  //                                 "name": "2234",
  //                                 "userImage": null,
  //                                 "children": []
  //                             },
  //                             {
  //                                 "id": 18,
  //                                 "name": "23232",
  //                                 "userImage": null,
  //                                 "children": []
  //                             }
  //                         ]
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // ]

    this.route.data.subscribe(data => {
      this.familyTree = data['treeList'];
    });
  }

  printNode(node){
    alert('done');
    console.log(node);
  }

  
  showUserDetails(node: any){  
    this.spinner.show();
    this._parentId = node.data.id;
    this.userService.getUserInfo(node.data.id)
        .subscribe(_userData => {
          setTimeout(() => {
            this.userData = _userData;
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
