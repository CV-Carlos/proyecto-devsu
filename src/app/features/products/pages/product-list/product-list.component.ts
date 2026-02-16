import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterLink, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchTerm: string = '';
  isLoading = false;
  errorMessage = '';
  Math = Math;

  // Menu
  openMenuId: string | null = null;
  isModalOpen = false;
  productToDelete: Product | null = null;
  isDeleting = false;

  // Pagination
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.btn-menu') && !target.closest('.context-menu')) {
      this.openMenuId = null;
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = products;
        this.updatePagination();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();

      this.filteredProducts = this.products.filter(
        product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower)
      );
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  toggleMenu(productId: string): void {
    this.openMenuId = this.openMenuId === productId ? null : productId;
  }

  editProduct(productId: string): void {
    this.openMenuId = null;
    this.router.navigate(['/products/edit', productId]);
  }

  deleteProduct(productId: string): void {
    this.openMenuId = null;
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.productToDelete = product;
      this.isModalOpen = true;
    }
  }

  onConfirmDelete(): void {
    if (!this.productToDelete) return;

    this.isDeleting = true;

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        // Eliminar el producto de la lista local
        this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
        this.filteredProducts = this.filteredProducts.filter(
          p => p.id !== this.productToDelete!.id
        );

        // Actualizar paginación
        this.updatePagination();

        // Cerrar modal
        this.isModalOpen = false;
        this.productToDelete = null;
        this.isDeleting = false;
      },
      error: error => {
        this.errorMessage = error.message;
        this.isDeleting = false;
        this.isModalOpen = false;
        this.productToDelete = null;
      }
    });
  }

  onCancelDelete(): void {
    this.isModalOpen = false;
    this.productToDelete = null;
  }
}
