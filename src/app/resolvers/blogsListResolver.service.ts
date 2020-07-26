import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify.service';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { AuthService } from '../services/auth.service';


@Injectable()
export class BlogsListResolverService implements Resolve<Blog[]> {

  constructor(private blogSservice: BlogService, private alertify: AlertifyService, private router: Router,
    private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Blog[]> {
    return this.blogSservice.getAll(1).pipe(
      catchError(error => {
        this.alertify.error('خطأ اثناء تحميل البيانات');
        //this.router.navigate(['/login']);
        this.authService.logout();
          return of(null);
      })
    )
  }
  
  
}
