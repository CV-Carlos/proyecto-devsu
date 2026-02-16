import { TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { of, throwError, firstValueFrom } from 'rxjs';
import { ProductIdValidator } from './product-id.validator';
import { ProductService } from '../../core/services/product.service';

describe('ProductIdValidator', () => {
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    mockProductService = {
      verifyIdExists: jest.fn(),
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn()
    } as any;
  });

  it('should return null for empty value', async () => {
    const validator = ProductIdValidator.createValidator(mockProductService);
    const control = new FormControl('');

    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
  });

  it('should return null when ID does not exist', async () => {
    mockProductService.verifyIdExists.mockReturnValue(of(false));
    const validator = ProductIdValidator.createValidator(mockProductService);
    const control = new FormControl('newid123');

    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
    expect(mockProductService.verifyIdExists).toHaveBeenCalledWith('newid123');
  });

  it('should return error when ID already exists', async () => {
    mockProductService.verifyIdExists.mockReturnValue(of(true));
    const validator = ProductIdValidator.createValidator(mockProductService);
    const control = new FormControl('existingid');

    const result = await firstValueFrom(validator(control) as any);
    expect(result).toEqual({ idExists: true });
    expect(mockProductService.verifyIdExists).toHaveBeenCalledWith('existingid');
  });

  it('should return null when editing with same ID', async () => {
    const validator = ProductIdValidator.createValidator(mockProductService, 'currentid');
    const control = new FormControl('currentid');

    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
    expect(mockProductService.verifyIdExists).not.toHaveBeenCalled();
  });

  it('should handle service errors gracefully', async () => {
    mockProductService.verifyIdExists.mockReturnValue(throwError(() => new Error('Service error')));
    const validator = ProductIdValidator.createValidator(mockProductService);
    const control = new FormControl('testid');

    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
  });
});
