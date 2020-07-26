import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import {TreeNode} from 'primeng/api';


@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {
  familyTree: any;
  imgUrl = environment.imageUrl + "UserImages/";
  data: TreeNode[];

  constructor(private route: ActivatedRoute) { }

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


}
