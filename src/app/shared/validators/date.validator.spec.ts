import { FormControl, FormGroup } from '@angular/forms';
import { DateValidator } from './date.validator';

describe('DateValidator', () => {
  describe('minDate', () => {
    it('should return null for empty value', () => {
      const minDate = new Date('2024-01-01');
      const validator = DateValidator.minDate(minDate);
      const control = new FormControl('');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null when date is equal to min date', () => {
      const minDate = new Date('2024-01-01');
      const validator = DateValidator.minDate(minDate);
      const control = new FormControl('2024-01-01');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null when date is after min date', () => {
      const minDate = new Date('2024-01-01');
      const validator = DateValidator.minDate(minDate);
      const control = new FormControl('2024-01-02');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return error when date is before min date', () => {
      const minDate = new Date('2024-01-01');
      const validator = DateValidator.minDate(minDate);
      const control = new FormControl('2023-12-31');

      const result = validator(control);

      expect(result).toEqual({ minDate: true });
    });
  });

  describe('revisionDateValidator', () => {
    it('should return null for empty value', () => {
      const validator = DateValidator.revisionDateValidator();
      const control = new FormControl('');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null when no parent form group', () => {
      const validator = DateValidator.revisionDateValidator();
      const control = new FormControl('2025-01-01');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null when no release date in parent', () => {
      const formGroup = new FormGroup({
        date_revision: new FormControl('2025-01-01')
      });

      const validator = DateValidator.revisionDateValidator();
      const result = validator(formGroup.get('date_revision')!);

      expect(result).toBeNull();
    });

    it('should return null when revision date is exactly one year after release date', () => {
      const formGroup = new FormGroup({
        date_release: new FormControl('2024-01-01'),
        date_revision: new FormControl('2025-01-01', DateValidator.revisionDateValidator())
      });

      const control = formGroup.get('date_revision')!;
      const result = control.errors;

      expect(result).toBeNull();
    });

    it('should return error when revision date is not one year after release date', () => {
      const formGroup = new FormGroup({
        date_release: new FormControl('2024-01-01'),
        date_revision: new FormControl('2025-02-01', DateValidator.revisionDateValidator())
      });

      const control = formGroup.get('date_revision')!;
      formGroup.get('date_release')!.updateValueAndValidity();
      control.updateValueAndValidity();

      expect(control.errors).toEqual({ invalidRevisionDate: true });
    });
  });
});
