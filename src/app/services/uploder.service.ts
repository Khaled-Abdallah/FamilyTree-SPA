import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploderService {
  private baseUrl = environment.apiUrl + 'uploader/upload/';
  
  constructor(private http: HttpClient) { }

  postFile(file: File, path: string) {      
    var formData: FormData = new FormData();
    formData.append('file',file);
    
    return this.http.post(this.baseUrl + path, formData, { responseType: 'text' });       
  }
}
