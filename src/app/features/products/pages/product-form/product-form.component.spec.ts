import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    mockProductService = {
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      verifyIdExists: jest.fn().mockReturnValue(of(false))
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    formBuilder = TestBed.inject(FormBuilder);
    component = new ProductFormComponent(
      formBuilder,
      mockProductService,
      mockRouter,
      mockActivatedRoute
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.initForm();

    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')?.value).toBe('');
    expect(component.productForm.get('name')?.value).toBe('');
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.productForm.get('logo')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    component.initForm();
    expect(component.productForm.valid).toBe(false);
  });

  it('should validate required fields', () => {
    component.initForm();

    const idControl = component.productForm.get('id');
    const nameControl = component.productForm.get('name');
    const descControl = component.productForm.get('description');
    const logoControl = component.productForm.get('logo');

    idControl?.markAsTouched();
    nameControl?.markAsTouched();
    descControl?.markAsTouched();
    logoControl?.markAsTouched();

    expect(idControl?.hasError('required')).toBe(true);
    expect(nameControl?.hasError('required')).toBe(true);
    expect(descControl?.hasError('required')).toBe(true);
    expect(logoControl?.hasError('required')).toBe(true);
  });

  it('should validate ID min length', () => {
    component.initForm();
    const idControl = component.productForm.get('id');

    idControl?.setValue('ab');
    idControl?.markAsTouched();

    expect(idControl?.hasError('minlength')).toBe(true);
    expect(component.getFieldError('id')).toBe('ID debe tener mínimo 3 caracteres!');
  });

  it('should validate ID max length', () => {
    component.initForm();
    const idControl = component.productForm.get('id');

    idControl?.setValue('12345678901');
    idControl?.markAsTouched();

    expect(idControl?.hasError('maxlength')).toBe(true);
    expect(component.getFieldError('id')).toBe('ID debe tener máximo 10 caracteres!');
  });

  it('should validate name min length', () => {
    component.initForm();
    const nameControl = component.productForm.get('name');

    nameControl?.setValue('Test');
    nameControl?.markAsTouched();

    expect(nameControl?.hasError('minlength')).toBe(true);
  });

  it('should validate description min length', () => {
    component.initForm();
    const descControl = component.productForm.get('description');

    descControl?.setValue('Short');
    descControl?.markAsTouched();

    expect(descControl?.hasError('minlength')).toBe(true);
  });

  it('should auto-calculate revision date', () => {
    component.initForm();

    const releaseDate = '2024-01-01';
    component.productForm.get('date_release')?.setValue(releaseDate);

    const expectedRevisionDate = Product.calculateRevisionDate(releaseDate);
    expect(component.productForm.get('date_revision')?.value).toBe(expectedRevisionDate);
  });

  it('should reset form', () => {
    component.initForm();

    component.productForm.patchValue({
      id: 'test123',
      name: 'Test Product'
    });

    component.onReset();

    expect(component.productForm.get('id')?.value).toBe(null);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should return error messages for invalid fields', () => {
    component.initForm();

    const idControl = component.productForm.get('id');
    idControl?.setValue('');
    idControl?.markAsTouched();

    expect(component.getFieldError('id')).toBe('ID es requerido!');
  });

  it('should return null when field is not touched', () => {
    component.initForm();
    const error = component.getFieldError('id');
    expect(error).toBeNull();
  });

  it('should identify invalid fields correctly', () => {
    component.initForm();
    const idControl = component.productForm.get('id');

    idControl?.setValue('');
    idControl?.markAsTouched();

    expect(component.isFieldInvalid('id')).toBe(true);
  });

  it('should not submit invalid form', () => {
    component.initForm();

    component.productForm.patchValue({
      id: 'ab',
      name: 'Test'
    });

    component.onSubmit();

    expect(mockProductService.createProduct).not.toHaveBeenCalled();
  });

  it('should set edit mode when ID is in route', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('edit123');

    const testProduct = new Product({
      id: 'edit123',
      name: 'Edit Product',
      description: 'Edit Description for product',
      logo: 'edit-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    mockProductService.getProducts.mockReturnValue(of([testProduct]));

    component.initForm();
    component.checkEditMode();

    expect(component.isEditMode).toBe(true);
    expect(component.currentProductId).toBe('edit123');
  });

  it('should disable ID field in edit mode', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('edit123');

    const testProduct = new Product({
      id: 'edit123',
      name: 'Edit Product',
      description: 'Edit Description for product',
      logo: 'edit-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    mockProductService.getProducts.mockReturnValue(of([testProduct]));

    component.initForm();
    component.loadProduct('edit123');

    expect(component.productForm.get('id')?.disabled).toBe(true);
  });

  it('should show error when product not found', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('notfound');
    mockProductService.getProducts.mockReturnValue(of([]));

    component.initForm();
    component.loadProduct('notfound');

    expect(component.errorMessage).toBe('Producto no encontrado');
  });
  it('should handle successful product creation', done => {
    component.initForm();
    component.isEditMode = false;

    const newProduct = new Product({
      id: 'test123',
      name: 'Test Product Name',
      description: 'Test Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    mockProductService.createProduct.mockReturnValue(of(newProduct));

    // Hacer el formulario válido manualmente
    component.productForm.patchValue({
      id: 'test123',
      name: 'Test Product Name',
      description: 'Test Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    // Simular formulario válido
    jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);

    component.onSubmit();

    setTimeout(() => {
      expect(mockProductService.createProduct).toHaveBeenCalled();
      expect(component.successMessage).toBe('Producto creado exitosamente');
      done();
    }, 100);
  });

  it('should handle successful product update', done => {
    component.initForm();
    component.isEditMode = true;
    component.currentProductId = 'edit123';

    const updatedProduct = new Product({
      id: 'edit123',
      name: 'Updated Product',
      description: 'Updated Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    mockProductService.updateProduct.mockReturnValue(of(updatedProduct));

    component.productForm.patchValue({
      id: 'edit123',
      name: 'Updated Product',
      description: 'Updated Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);

    component.onSubmit();

    setTimeout(() => {
      expect(mockProductService.updateProduct).toHaveBeenCalledWith('edit123', expect.any(Product));
      expect(component.successMessage).toBe('Producto actualizado exitosamente');
      done();
    }, 100);
  });

  it('should handle error on product creation', done => {
    component.initForm();
    component.isEditMode = false;

    const error = new Error('Error al crear producto');
    mockProductService.createProduct.mockReturnValue(throwError(() => error));

    component.productForm.patchValue({
      id: 'test123',
      name: 'Test Product Name',
      description: 'Test Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage).toBe('Error al crear producto');
      expect(component.isSubmitting).toBe(false);
      done();
    }, 100);
  });

  it('should handle error on product update', done => {
    component.initForm();
    component.isEditMode = true;
    component.currentProductId = 'edit123';

    const error = new Error('Error al actualizar producto');
    mockProductService.updateProduct.mockReturnValue(throwError(() => error));

    component.productForm.patchValue({
      id: 'edit123',
      name: 'Updated Product',
      description: 'Updated Description for product',
      logo: 'https://test.com/logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage).toBe('Error al actualizar producto');
      expect(component.isSubmitting).toBe(false);
      done();
    }, 100);
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    component.initForm();

    component.onSubmit();

    expect(component.productForm.get('id')?.touched).toBe(true);
    expect(component.productForm.get('name')?.touched).toBe(true);
    expect(component.productForm.get('description')?.touched).toBe(true);
    expect(component.productForm.get('logo')?.touched).toBe(true);
  });

  it('should handle all field error types', () => {
    component.initForm();

    // Test date_release errors
    const dateReleaseControl = component.productForm.get('date_release');
    dateReleaseControl?.markAsTouched();
    dateReleaseControl?.setErrors({ required: true });
    expect(component.getFieldError('date_release')).toBe('Fecha de liberación es requerida!');

    dateReleaseControl?.setErrors({ minDate: true });
    expect(component.getFieldError('date_release')).toBe(
      'Fecha de liberación debe ser igual o mayor a la fecha actual!'
    );

    // Test errores en validacion de datos
    const dateRevisionControl = component.productForm.get('date_revision');
    dateRevisionControl?.markAsTouched();
    dateRevisionControl?.setErrors({ required: true });
    expect(component.getFieldError('date_revision')).toBe('Fecha de revisión es requerida!');

    dateRevisionControl?.setErrors({ invalidRevisionDate: true });
    expect(component.getFieldError('date_revision')).toBe(
      'Fecha de revisión debe ser exactamente un año posterior a la fecha de liberación!'
    );
  });

  it('should handle error when loading product', () => {
    component.initForm();

    const error = new Error('Error loading product');
    mockProductService.getProducts.mockReturnValue(throwError(() => error));

    component.loadProduct('test123');

    expect(component.errorMessage).toBe('Error loading product');
  });

  it('should initialize today date', () => {
    component.initForm();
    expect(component.today).toBeDefined();
    expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
