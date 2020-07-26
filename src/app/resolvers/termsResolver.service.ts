import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify.service';
import { DefinitionLineage } from '../models/DefinitionLineage';
import { DefinitionService } from '../services/definition.service';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';


@Injectable()
export class TermsResolverService implements Resolve<any> {

  constructor(private settingsService: SettingsService, private alertify: AlertifyService, private router: Router,
    private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.settingsService.getTerms().pipe(
      catchError(error => {
          this.alertify.error('خطأ اثناء تحميل البيانات');        
         this.authService.logout();
          return of(null);
      })
    )
  }
  
  
}
