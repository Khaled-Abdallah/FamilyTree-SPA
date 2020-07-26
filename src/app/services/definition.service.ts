import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefinitionLineage } from '../models/DefinitionLineage';

@Injectable({
  providedIn: 'root'
})
export class DefinitionService {
  private baseUrl = environment.apiUrl + 'DefinitionLineage/';

  constructor(private http: HttpClient) { }

  get(): any {
    return this.http.get(this.baseUrl + 'get');
  }

  save(model: any) {
    return this.http.post(this.baseUrl + 'add' , model);
  }

  update(model: any) {
    return this.http.post(this.baseUrl + 'update' , model)
  }
    
}
