import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Product } from '../../core/models/product.model';

export class DateValidator {
  static minDate(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const compareDate = new Date(minDate);

      // Resetear las horas para comparar solo fechas
      inputDate.setHours(0, 0, 0, 0);
      compareDate.setHours(0, 0, 0, 0);

      return inputDate < compareDate ? { minDate: true } : null;
    };
  }

  static revisionDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }

      const releaseDate = formGroup.get('date_release')?.value;
      if (!releaseDate) {
        return null;
      }

      const expectedRevisionDate = Product.calculateRevisionDate(releaseDate);
      return control.value !== expectedRevisionDate ? { invalidRevisionDate: true } : null;
    };
  }
}
