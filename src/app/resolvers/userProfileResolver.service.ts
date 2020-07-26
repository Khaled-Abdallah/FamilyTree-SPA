import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { User } from '../models/User';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class UserProfileResolverService implements Resolve<any> {

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.authService.getUserLogin().pipe(
      catchError(error => {
          this.alertify.error('خطأ اثناء تحميل البيانات');
          this.authService.logout();
          return of(null);
      })
    )
  }
  
  
}
