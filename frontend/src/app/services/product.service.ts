import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

export interface ApiProduct {
  id: number;
  name: string;
  origin: string;
  price: number | string;
  unit: string;
  description: string;
  quantity: number;
  image?: string;
  image_url_legacy?: string;
  certificate?: string;
  certificate_url?: string;
  ownerId: number | string;
  ownerName?: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/productos/';
  
  private productsSubject = new BehaviorSubject<ApiProduct[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  async refreshProducts(): Promise<void> {
    try {
      const products = await firstValueFrom(this.http.get<ApiProduct[]>(this.apiUrl));
      this.productsSubject.next(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async createProduct(payload: Partial<ApiProduct>): Promise<ApiProduct> {
    const newProduct = await firstValueFrom(this.http.post<ApiProduct>(this.apiUrl, payload));
    await this.refreshProducts();
    return newProduct;
  }

  async updateProduct(id: number | string, payload: Partial<ApiProduct>): Promise<ApiProduct> {
    const updatedProduct = await firstValueFrom(this.http.patch<ApiProduct>(`${this.apiUrl}${id}/`, payload));
    await this.refreshProducts();
    return updatedProduct;
  }

  async deleteProduct(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}${id}/`));
    await this.refreshProducts();
  }
}
