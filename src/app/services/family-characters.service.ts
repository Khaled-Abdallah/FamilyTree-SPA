import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FamilyChar } from '../models/familyChar';

@Injectable({
  providedIn: 'root'
})
export class FamilyCharactersService {

  private baseUrl = environment.apiUrl + 'admin/familyCharacters/';

  constructor(private http: HttpClient) { }

  getAll(pageNo: number): any {
    return this.http.get(this.baseUrl + 'getFamilyChars?pageNo=' + pageNo);
  }

  getFamilyCharStatus(status: boolean, pageNo: number): any {
    return this.http.get(this.baseUrl + 'getFamilyCharByStatus/'+ status + '/' + pageNo);
  }

  filterFamilyChar(sreachKey: string): any {
    return this.http.get(this.baseUrl + 'filterFamilyChar/'+ sreachKey);
  }

  delete(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteFamilyChar/' + id);
  }

  setAcceptStatus(status: boolean,id: Number): any {
    return this.http.get(this.baseUrl + 'setAcceptStatus/'+ status +'/'+ id);
  }
  
  get(id: Number): any {
    return this.http.get(this.baseUrl + 'getFamilyCharById/'+ id);
  }

  update(model: any) {
    return this.http.post(this.baseUrl + 'updateFC' , model)
  }
  
  save(familyChar: FamilyChar) {
    return this.http.post(this.baseUrl + 'add' , familyChar);
  }

  getFamilyCharWattings(pageNo: number): any {
    return this.http.get(this.baseUrl + 'getFamilyCharWattings?pageNo=' + pageNo);
  }

  // getFamilyCharWatting(): any {
  //   return this.http.get(this.baseUrl + 'getFamilyCharWatting');
  // }

  updateFamilyCharStatus(fcId: Number, status: boolean): any {
    return this.http.get(this.baseUrl + 'updateFamilyCharStatus/'+ status +'/'+ fcId);
  }

}
