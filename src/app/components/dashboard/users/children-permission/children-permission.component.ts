import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'children-permission',
  templateUrl: './children-permission.component.html',
  styleUrls: ['./children-permission.component.css']
})
export class ChildrenPermissionComponent implements OnInit {
  @Input() userInfo: any = {};
  
  constructor() { }

  ngOnInit() {
  }

}
