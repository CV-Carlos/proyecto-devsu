import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import {
  VALIDATION_RULES,
  VALIDATION_MESSAGES
} from '../../../../core/constants/validation.constants';
import { API_MESSAGES } from '../../../../core/constants/api.constants';
import { ProductIdValidator } from '../../../../shared/validators/product-id.validator';
import { DateValidator } from '../../../../shared/validators/date.validator';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  currentProductId?: string;

  validationMessages = VALIDATION_MESSAGES;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkEditMode();
    this.initForm();
    if (this.isEditMode && this.currentProductId) {
      this.loadProduct(this.currentProductId);
    }
  }

  initForm(): void {
    const asyncValidators = this.isEditMode 
    ? [] 
    : [ProductIdValidator.createValidator(this.productService, this.currentProductId)];
    this.productForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(VALIDATION_RULES.ID.MIN_LENGTH),
          Validators.maxLength(VALIDATION_RULES.ID.MAX_LENGTH)
        ],
        asyncValidators
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(VALIDATION_RULES.NAME.MIN_LENGTH),
          Validators.maxLength(VALIDATION_RULES.NAME.MAX_LENGTH)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(VALIDATION_RULES.DESCRIPTION.MIN_LENGTH),
          Validators.maxLength(VALIDATION_RULES.DESCRIPTION.MAX_LENGTH)
        ]
      ],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, DateValidator.minDate(new Date())]],
      date_revision: ['', [Validators.required, DateValidator.revisionDateValidator()]]
    });

    // Auto-calcular fecha de revisión cuando cambia la fecha de liberación
    this.productForm.get('date_release')?.valueChanges.subscribe(releaseDate => {
      if (releaseDate) {
        const revisionDate = Product.calculateRevisionDate(releaseDate);
        this.productForm.get('date_revision')?.setValue(revisionDate);
      }
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentProductId = id;
    }
  }

  loadProduct(id: string): void {
    this.productService.getProducts().subscribe({
      next: products => {
        const product = products.find(p => p.id === id);
        if (product) {
          this.productForm.patchValue(product);
          this.productForm.get('id')?.disable();
        } else {
          this.errorMessage = API_MESSAGES.ERROR_NOT_FOUND;
        }
      },
      error: error => {
        this.errorMessage = error.message;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.productForm.getRawValue();
    const product = new Product(formValue);

    const request = this.isEditMode
      ? this.productService.updateProduct(this.currentProductId!, product)
      : this.productService.createProduct(product);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? API_MESSAGES.PRODUCT_UPDATED
          : API_MESSAGES.PRODUCT_CREATED;

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: error => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
      }
    });
  }

  onReset(): void {
    this.productForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.productForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    const errors = field.errors;

    // Manejo específico por campo
    switch (fieldName) {
      case 'id':
        if (errors['required']) return VALIDATION_MESSAGES.ID.REQUIRED;
        if (errors['minlength']) return VALIDATION_MESSAGES.ID.MIN_LENGTH;
        if (errors['maxlength']) return VALIDATION_MESSAGES.ID.MAX_LENGTH;
        if (errors['idExists']) return VALIDATION_MESSAGES.ID.ALREADY_EXISTS;
        break;

      case 'name':
        if (errors['required']) return VALIDATION_MESSAGES.NAME.REQUIRED;
        if (errors['minlength']) return VALIDATION_MESSAGES.NAME.MIN_LENGTH;
        if (errors['maxlength']) return VALIDATION_MESSAGES.NAME.MAX_LENGTH;
        break;

      case 'description':
        if (errors['required']) return VALIDATION_MESSAGES.DESCRIPTION.REQUIRED;
        if (errors['minlength']) return VALIDATION_MESSAGES.DESCRIPTION.MIN_LENGTH;
        if (errors['maxlength']) return VALIDATION_MESSAGES.DESCRIPTION.MAX_LENGTH;
        break;

      case 'logo':
        if (errors['required']) return VALIDATION_MESSAGES.LOGO.REQUIRED;
        break;

      case 'date_release':
        if (errors['required']) return VALIDATION_MESSAGES.DATE_RELEASE.REQUIRED;
        if (errors['minDate']) return VALIDATION_MESSAGES.DATE_RELEASE.INVALID_DATE;
        break;

      case 'date_revision':
        if (errors['required']) return VALIDATION_MESSAGES.DATE_REVISION.REQUIRED;
        if (errors['invalidRevisionDate']) return VALIDATION_MESSAGES.DATE_REVISION.INVALID_DATE;
        break;
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
