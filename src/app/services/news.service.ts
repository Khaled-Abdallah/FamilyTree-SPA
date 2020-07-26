import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Filters } from '../models/filterBlogs';
import { News } from '../models/news';
import { Comments } from '../models/blogComment';
import { NewsComments } from '../models/newsComments';
import { NewsImage } from '../models/newsImage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl = environment.apiUrl + 'admin/news/';

  counter = new BehaviorSubject<number>(0);
  //currentCounter = this.counter.asObservable();
  changeCounter() {
    this.counter.next(0);
 }

  constructor(private http: HttpClient) { }

  getAll(pageNo: number): any {
    return this.http.get(this.baseUrl + 'getNews?pageNo=' + pageNo);
  }

  getById(id: Number): any {
    return this.http.get(this.baseUrl + 'getNewsById/' + id);
  }

  getNewsById(id: Number): any {
    return this.http.get(this.baseUrl + 'getNewsBy/' + id);
  }

  getComments(id: Number): any {
    return this.http.get(this.baseUrl + 'GetComments/' + id);
  }
  
  getCommentsPaging(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getComments/' + id + '?pageNo=' + pageNo);
  }

  acceptUserComment(newsId: Number, commentId: Number): any {
    return this.http.get(this.baseUrl + 'acceptUserComment/' + newsId + '?commentId=' + commentId);
  }

  getNewsByStatus(status: boolean, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getNewsByStatus/'+ status + '?pageNo=' + pageNo);
  }

  delete(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteNews/' + id);
  }

  filterNews(filters: Filters) {
    return this.http.post(this.baseUrl + 'filterNews' , filters);
  }

  save(news: News) {
    return this.http.post(this.baseUrl + 'addNews' , news);
  }

  update(news: News) {
    return this.http.post(this.baseUrl + 'updateNews' , news)
  }

  getNewsType(): any {
    return this.http.get(this.baseUrl + 'getNewsTypes');
  }

  setAcceptStatus(status: boolean,id: Number): any {
    return this.http.get(this.baseUrl + 'setAcceptStatus/'+ status +'/'+ id);
  }

  setNotAcceptStatus(status: boolean,id: Number, userId: Number, body: any): any {
    return this.http.get(this.baseUrl + 'setNotAcceptStatus/'+ status +'/'+ id+ '?userId='+ userId +'&body='+ body);    
  }

  addNewsComment(comment: NewsComments) {
    return this.http.post(this.baseUrl + 'addNewsComment' , comment);
  }

  deleteComment(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteComment/' + id);
  }
  
  deleteImage(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteImage/' + id);
  }

  setMainImage(image: NewsImage): any {     
    return this.http.post(this.baseUrl + 'setImageMain', image);
  }
  
  getNewsWatting(pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getNewsWatting?pageNo=' + pageNo);
  }

  getNewsRefusalComments(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getNewsRefusalComments/' + id + '?pageNo=' + pageNo);
  }

  getNewsCommentsWatting(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getCommentsWatting/' + id + '?pageNo=' + pageNo);
  }

  refuseUserComment(newsId: Number, commentId: Number): any {
    return this.http.get(this.baseUrl + 'refuseUserComment/' + newsId + '?commentId=' + commentId);
  }


}
