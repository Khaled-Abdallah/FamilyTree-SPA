import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog';
import { Filters } from '../models/filterBlogs';
import { Comments } from '../models/blogComment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  notifyNum = new BehaviorSubject<string>('user.png');
  private baseUrl = environment.apiUrl + 'admin/Blog/';

  constructor(private http: HttpClient) { }

//   increaseNotify(num: any) {
//     localStorage.setItem('image', imgUrl);
//     this.imgUrl.next(imgUrl);
// }

  getAll(pageNo: number): any {
    return this.http.get(this.baseUrl + 'getBlogs?pageNo=' + pageNo);
  }

  getBlogById(id: Number): any {
    return this.http.get(this.baseUrl + 'getBlogById/' + id);
  }

  save(blog: Blog) {
    return this.http.post(this.baseUrl + 'addBlog' , blog);
  }

  update(blog: Blog) {
    return this.http.post(this.baseUrl + 'updateBlog' , blog)
  }

  getCount(): any {
    return this.http.get(this.baseUrl + 'getBlogsCount');
  }

  delete(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteBlog/' + id);
  }

  deleteComment(id: Number): any {
    return this.http.get(this.baseUrl + 'deleteComment/' + id);
  }

  getBlogsStatus(status: boolean): any {
    return this.http.get(this.baseUrl + 'getBlogsByStatus/'+ status);
  }

  getBlogs_Status(status: any, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getBlogsByStatus?status='+ status+'&pageNo=' + pageNo);
  }

  setAcceptStatus(status: boolean,id: Number): any {
    return this.http.get(this.baseUrl + 'setAcceptStatus/'+ status +'/'+ id);
  }

  setNotAcceptStatus(blogId: Number,userId: Number, body: any): any {
    return this.http.get(this.baseUrl + 'setNotAcceptStatus?blogId='+ blogId + '&userId='+ userId +'&body='+ body);
  }

  getComments(id: Number): any {
    return this.http.get(this.baseUrl + 'getComments/' + id);
  }

  getCommentsPaging(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getComments/' + id + '?pageNo=' + pageNo);
  }

  filterBlog(filters: Filters) {
    return this.http.post(this.baseUrl + 'filterBlogs' , filters);
  }
  
  addBlogComment(blogComment: Comments) {
    return this.http.post(this.baseUrl + 'addBlogComment' , blogComment);
  }

  getBlogCommentsWatting(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getBlogCommentsWatting/' + id + '?pageNo=' + pageNo);
  }

  acceptUserBlogComment(newsId: Number, commentId: Number, status: boolean): any {
    return this.http.get(this.baseUrl + 'acceptUserBlogComment/'+ newsId + '/' + status +  '?commentId=' + commentId);
  }

  getBlogRefusalComments(id: Number, pageNo: Number): any {
    return this.http.get(this.baseUrl + 'getBlogRefusalComments/' + id + '?pageNo=' + pageNo);
  }


}
