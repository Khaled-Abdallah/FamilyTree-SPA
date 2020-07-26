import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SettingImage } from '../models/settingImage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private baseUrl = environment.apiUrl + 'definitionLineage/';
  private urlTerms = environment.apiUrl + 'terms/';
  private urlSettings = environment.apiUrl + 'admin/settings/';

  constructor(private http: HttpClient) { }

  getDefinition(): any {
    return this.http.get(this.baseUrl + 'get');
  }

  saveDefinition(model: any) {
    return this.http.post(this.baseUrl + 'add' , model);
  }

  updateDefinition(model: any) {
    return this.http.post(this.baseUrl + 'update' , model)
  }

  //==============

  getTerms(): any {
    return this.http.get(this.urlTerms + 'get');
  }

  saveTerms(model: any) {
    return this.http.post(this.urlTerms + 'add' , model);
  }

  updateTerms(model: any) {
    return this.http.post(this.urlTerms + 'update' , model)
  }

    //=====================================
    getSettings(): any {
      return this.http.get(this.urlSettings + 'getSettings');
    }

    addSettings(model: any) {
      return this.http.post(this.urlSettings + 'add' , model);
    }
  
    updateSettings(model: any) {
      return this.http.post(this.urlSettings + 'update' , model)
    }
  
    saveImageSetting(logoName: string ,settingImage: SettingImage) {
      //return this.http.post(this.baseUrl + 'add' , model);
      return this.http.post(this.urlSettings + 'saveSettingImage/' + logoName, settingImage);
    }
    

    
}
