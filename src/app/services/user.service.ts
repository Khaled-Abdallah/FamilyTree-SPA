import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog';
import { TreeviewItem } from 'ngx-treeview';
import { Filters } from '../models/filterBlogs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _accounturl = environment.apiUrl + 'account/';
  private _url = environment.apiUrl + 'admin/user/';
  private _urlUser = environment.apiUrl + 'admin/user/';
  private _urlUserWifes = environment.apiUrl + 'Wife/';
  private _urlFamily = environment.apiUrl + 'family/';
  

  constructor(private http: HttpClient) { }

  getUserPermission(pageNo: number): any {
    return this.http.get(this._url + 'getUserPermission?pageNo=' + pageNo);
  }

  updatePermission(permissions: any) {
    return this.http.post(this._url + 'updatePermission' , permissions)
  }

  getFamilyTree(): any {
    return this.http.get(this._url + 'getFamilyTree');
  }

  getFamilyTreeForMobile(): any {
    return this.http.get(this._url + 'getFamilyTreeForMobile');
  }

//   getBooks(): TreeviewItem[] {
//     const childrenCategory = new TreeviewItem({
//         text: 'Children', value: 1, collapsed: true, children: [
//             { text: 'Baby 3-5', value: 11 },
//             { text: 'Baby 6-8', value: 12 },
//             { text: 'Baby 9-12', value: 13 }
//         ]
//     });
//     const itCategory = new TreeviewItem({
//         text: 'IT', value: 9, children: [
//             {
//                 text: 'Programming', value: 91, children: [{
//                     text: 'Frontend', value: 911, children: [
//                         { text: 'Angular 1', value: 9111 },
//                         { text: 'Angular 2', value: 9112 },
//                         { text: 'ReactJS', value: 9113 }
//                     ]
//                 }, {
//                     text: 'Backend', value: 912, children: [
//                         { text: 'C#', value: 9121 },
//                         { text: 'Java', value: 9122 },
//                         { text: 'Python', value: 9123 }
//                     ]
//                 }]
//             },
//             {
//                 text: 'Networking', value: 92, children: [
//                     { text: 'Internet', value: 921 },
//                     { text: 'Security', value: 922 }
//                 ]
//             }
//         ]
//     });
//     const teenCategory = new TreeviewItem({
//         text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
//             { text: 'Adventure', value: 21 },
//             { text: 'Science', value: 22 }
//         ]
//     });
//     const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
//     return [childrenCategory, itCategory];
// }

  filterUserPermission(search: any) {
    return this.http.get(this._url + 'filterUserPermissions?search=' +search);
  }

  getUserById(id: Number): any {
    return this.http.get(this._url + 'getUser/' + id);
  }

  getFatherData(parentId: Number): any {
    return this.http.get(this._url + 'getFather/' + parentId);
  }


   getUser_ById(id: Number): any {
    return this.http.get(this._url + 'getUserById/' + id);
  }

  getUsers(pageNo: number): any {
    return this.http.get(this._url + 'getUsers?pageNo=' + pageNo);
  }
  
  updateUserStatus(id: Number, status: boolean): any {
    return this.http.get(this._url + 'updateUserStatus/'+ status +'/'+ id);
  }
  
  getUsersStatus(status: boolean): any {
    return this.http.get(this._url + 'getUsersByStatus/'+ status);
  }

  filterUsers(search: any) {
    return this.http.get(this._url + 'filterUsers?search= '+ search);
  }

  getBirthDateH(dateM: any) {
    return this.http.get(this._url + 'getBirthDateH?dateM= '+ dateM, {responseType: 'text'});
  }

  getGenderTypes(): any {
    return this.http.get(this._urlUser + 'getGenderTypes');
  }

  getUsersNotAccepted(pageNo: number): any {
    return this.http.get(this._url + 'getUsersNotAccepted?pageNo=' + pageNo);
  }

  acceptUserAdd(id: Number, userMail: string, IDn: string): any {
    return this.http.get(this._url + 'acceptUserAdd/'+ id +'/'+ userMail + '/' + IDn);
  }

  filterUserNotAccepted(searchKey: string): any {
    return this.http.get(this._url + 'filterUserNotAccepted?searchKey=' + searchKey);
  }

  addChildren(user: any) {
    return this.http.post(this._url + 'addChildren' , user)
  }

  getwifes(userId: Number): any {
    return this.http.get(this._urlUserWifes + 'getWifes/' + userId);
  }

  getFamily(): any {
    return this.http.get(this._urlFamily + 'getFamilies' );
  }

  getUserInfo(userId: Number): any {
    return this.http.get(this._url + 'getUserInfo/'+ userId );
  }
  
  updateUserInfo(user: any) {
    return this.http.post(this._url + 'updateUserInfo' , user)
  }

  updateUserLoginData(user: any) {
    return this.http.post(this._url + 'updateUserLoginData' , user)
  }

  getUserChildren(parentId: Number): any {
    return this.http.get(this._url + 'getUserChildren/'+ parentId );
  }

  getParents(): any {
    return this.http.get(this._url + 'getParents' );
  }

  save(user: any) {
    return this.http.post(this._accounturl + 'register2' , user)
  }

  


}
