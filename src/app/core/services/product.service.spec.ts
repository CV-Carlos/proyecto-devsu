import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { API_CONFIG } from '../constants';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'test1',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('test1');
      expect(products[0].name).toBe('Test Product');
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should verify if ID exists', () => {
    const testId = 'test123';

    service.verifyIdExists(testId).subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFICATION}/${testId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should create a product', () => {
    const newProduct = new Product({
      id: 'new123',
      name: 'New Product',
      description: 'New Description',
      logo: 'new-logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    service.createProduct(newProduct).subscribe(product => {
      expect(product.id).toBe('new123');
      expect(product.name).toBe('New Product');
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: newProduct });
  });

  it('should update a product', () => {
    const updatedProduct = new Product({
      id: 'test1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    });

    service.updateProduct('test1', updatedProduct).subscribe(product => {
      expect(product.name).toBe('Updated Product');
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/test1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ data: updatedProduct });
  });

  it('should delete a product', () => {
    const productId = 'test1';

    service.deleteProduct(productId).subscribe(message => {
      expect(message).toBe('Product removed successfully');
    });

    const req = httpMock.expectOne(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });

  it('should handle error when getting products', () => {
    service.getProducts().subscribe({
      next: () => fail('should have failed'),
      error: error => {
        expect(error.message).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle 404 error', () => {
    service.getProducts().subscribe({
      next: () => fail('should have failed'),
      error: error => {
        expect(error.message).toContain('Producto no encontrado');
      }
    });

    const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
