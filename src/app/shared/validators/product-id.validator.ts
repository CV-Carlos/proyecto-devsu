import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';

export class ProductIdValidator {
  static createValidator(productService: ProductService, currentId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Si estamos editando y el ID no cambió, no validar
      if (currentId && control.value === currentId) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap(id => 
          productService.verifyIdExists(id).pipe(
            map(exists => exists ? { idExists: true } : null),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }
}