import { Injectable, inject } from '@angular/core';
import { Database, ref, set, push, onValue, update, remove, get } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ApiProduct {
  id: string; // Firebase IDs are strings
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
  verification_status?: string;
  ownerId: number | string;
  ownerName?: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private db: Database = inject(Database);

  private productsSubject = new BehaviorSubject<ApiProduct[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor() {
    this.setupRealtimeListener();
  }

  private setupRealtimeListener() {
    const productsRef = ref(this.db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        this.productsSubject.next(products);
      } else {
        this.productsSubject.next([]);
      }
    });
  }

  async refreshProducts(): Promise<void> {
    // The realtime listener automatically updates the subject,
    // but we keep this method for backward compatibility in components.
    const productsRef = ref(this.db, 'products');
    const snapshot = await get(productsRef);
    const data = snapshot.val();
    if (data) {
      const products = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      this.productsSubject.next(products);
    } else {
      this.productsSubject.next([]);
    }
  }

  async createProduct(payload: Partial<ApiProduct>): Promise<ApiProduct> {
    const productsRef = ref(this.db, 'products');
    const newProductRef = push(productsRef);
    await set(newProductRef, payload);
    return { id: newProductRef.key as string, ...payload } as ApiProduct;
  }

  async updateProduct(id: string, payload: Partial<ApiProduct>): Promise<ApiProduct> {
    const productRef = ref(this.db, `products/${id}`);
    await update(productRef, payload);
    return { id, ...payload } as ApiProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = ref(this.db, `products/${id}`);
    await remove(productRef);
  }
}
