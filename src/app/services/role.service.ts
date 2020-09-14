import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../models/userRole';
import { AddUserRole } from '../models/addUerRole';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = environment.apiUrl + 'admin/role/';

   constructor(private http: HttpClient) { }
   
  getRoles(){
    return this.http.get(this.url + 'getRoles');
  }

  getUsersRole(roleId: Number){
    return this.http.get(this.url + 'getUsersRole/'+ roleId);
  }

  addSuperAdmin(userRole: UserRole) {
    return this.http.post(this.url + 'addSuperAdmin' , userRole)
  }

  deleteUserRole(email: any){
    return this.http.get(this.url + 'removeFromRole?email='+ email);
  }

  searchUsers(search: any) {
    return this.http.get(this.url + 'searchUsers?search=' +search);
  }

  addUerToRole(userRole: AddUserRole) {
    return this.http.post(this.url + 'addUerToRole' , userRole)
  }

  

}
