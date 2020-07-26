import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify.service';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';


@Injectable()
export class TreeListResolverService implements Resolve<any[]> {

  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router,
    private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.userService.getFamilyTreeForMobile().pipe(
      catchError(error => {
        this.alertify.error('خطأ اثناء تحميل البيانات');        
        this.authService.logout();
          return of(null);
      })
    )
  }
  
  
}
