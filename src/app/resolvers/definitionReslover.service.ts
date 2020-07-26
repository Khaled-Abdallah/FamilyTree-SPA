import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify.service';
import { DefinitionLineage } from '../models/DefinitionLineage';
import { DefinitionService } from '../services/definition.service';
import { AuthService } from '../services/auth.service';


@Injectable()
export class DefinitionResloverDervice implements Resolve<DefinitionLineage> {

  constructor(private definitionService: DefinitionService, private alertify: AlertifyService, private router: Router,
    private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DefinitionLineage> {
    return this.definitionService.get().pipe(
      catchError(error => {
          this.alertify.error('خطأ اثناء تحميل البيانات');        
          this.authService.logout();
          return of(null);
      })
    )
  }
  
  
}
