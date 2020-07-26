import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[checkMatchingPassword]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: MatchingPasswordDirective,
      multi: true
  }]
})
export class MatchingPasswordDirective {

  @Input() checkMatchingPassword: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
      const controlToCompare = control.parent.get(this.checkMatchingPassword);
      if (controlToCompare && controlToCompare.value !== control.value) {
          return { 'notEqual': true };
      }
      return null;
  }

}