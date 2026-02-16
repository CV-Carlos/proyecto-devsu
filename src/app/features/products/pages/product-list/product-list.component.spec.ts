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
    expect(component.paginatedProducts.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('should paginate products correctly', () => {
    const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 5;
    component.updatePagination();

    expect(component.paginatedProducts.length).toBe(5);
    expect(component.totalPages).toBe(3);
  });

  it('should change page size', () => {
    const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 5;
    component.updatePagination();

    expect(component.paginatedProducts.length).toBe(5);

    component.itemsPerPage = 10;
    component.onPageSizeChange();

    expect(component.paginatedProducts.length).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to next page', () => {
    const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 5;
    component.updatePagination();

    expect(component.currentPage).toBe(1);

    component.goToNextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should navigate to previous page', () => {
    const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 5;
    component.currentPage = 2;
    component.updatePagination();

    component.goToPreviousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should not go below page 1', () => {
    component.currentPage = 1;
    component.goToPreviousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should reset to page 1 when searching', () => {
    const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.currentPage = 3;
    component.searchTerm = 'test';

    component.onSearch();

    expect(component.currentPage).toBe(1);
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

  it('should generate page numbers correctly', () => {
    const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => 
      new Product({
        id: `test${i}`,
        name: `Test Product ${i}`,
        description: `Description ${i}`,
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      })
    );

    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 5;
    component.updatePagination();

    const pageNumbers = component.getPageNumbers();

    expect(pageNumbers.length).toBeGreaterThan(0);
    expect(pageNumbers.length).toBeLessThanOrEqual(5);
  });
});