import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { API_CONFIG, API_MESSAGES } from '../constants';
import { ApiResponse, VerificationResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

  constructor(private http: HttpClient) {}

  // F1: Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  // F4: Create product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      map(response => response.data!),
      catchError(this.handleError)
    );
  }

  // F5: Update product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => response.data!),
      catchError(this.handleError)
    );
  }

  // F6: Delete product
  deleteProduct(id: string): Observable<string> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.message),
      catchError(this.handleError)
    );
  }

  // Verify ID exists
  verifyIdExists(id: string): Observable<boolean> {
    const verificationUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFICATION}/${id}`;
    return this.http.get<boolean>(verificationUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = API_MESSAGES.ERROR_GENERIC;
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = API_MESSAGES.ERROR_NETWORK;
    } else {
      if (error.status === 404) {
        errorMessage = API_MESSAGES.ERROR_NOT_FOUND;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}