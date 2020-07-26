import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WifeService {
  private url = environment.apiUrl + 'wife/';

  constructor(private http: HttpClient) { }

  getWifes(userId: any): any {
    return this.http.get(this.url + 'getWifes/' + userId);
  }

  addWife(wife: any): any {
    return this.http.post(this.url + 'addWife' , wife)
  }

  updateWife(wife: any) {
    return this.http.post(this.url + 'updateWife' , wife)
  }

  deleteWife(id: Number): any {
    return this.http.get(this.url + 'deleteWife/' + id);
  }

}
