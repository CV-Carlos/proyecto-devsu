import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    mockProductService = {
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      verifyIdExists: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
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

    mockProductService.getProducts.mockReturnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.products.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('should filter products based on search term', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'card1',
        name: 'Tarjeta de Crédito',
        description: 'Tarjeta Gold',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      }),
      new Product({
        id: 'account1',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta Premium',
        logo: 'logo2.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.searchTerm = 'tarjeta';

    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Tarjeta de Crédito');
  });

  it('should search by ID', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'card1',
        name: 'Tarjeta de Crédito',
        description: 'Tarjeta Gold',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      }),
      new Product({
        id: 'account1',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta Premium',
        logo: 'logo2.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.searchTerm = 'card1';

    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('card1');
  });

  it('should search by description', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'card1',
        name: 'Tarjeta de Crédito',
        description: 'Tarjeta Gold',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      }),
      new Product({
        id: 'account1',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta Premium',
        logo: 'logo2.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.searchTerm = 'Premium';

    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].description).toBe('Cuenta Premium');
  });

  it('should clear search and show all products', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'test1',
        name: 'Test Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      }),
      new Product({
        id: 'test2',
        name: 'Test Product 2',
        description: 'Description 2',
        logo: 'logo2.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.searchTerm = 'test';
    component.filteredProducts = [mockProducts[0]];

    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should handle error when loading products', () => {
    const errorMessage = 'Error loading products';
    mockProductService.getProducts.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );

    component.ngOnInit();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });

  it('should show all products when search term is empty', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'test1',
        name: 'Test Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.searchTerm = '';

    component.onSearch();

    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should trim search term', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'test1',
        name: 'Test Product',
        description: 'Description',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.searchTerm = '  test  ';

    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
  });

  it('should be case insensitive in search', () => {
    const mockProducts: Product[] = [
      new Product({
        id: 'test1',
        name: 'Test Product',
        description: 'Description',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    ];

    component.products = mockProducts;
    component.searchTerm = 'TEST';

    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
  });
});