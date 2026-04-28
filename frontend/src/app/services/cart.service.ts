import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../catalogo/catalogo'; // Necesitamos exportar/importar Producto, ya lo estaba.

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  public cart$ = this.cartSubject.asObservable();

  constructor() { }

  addToCart(producto: Producto, cantidad: number) {
    const existingItem = this.cartItems.find(item => item.producto.id === producto.id);
    
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      this.cartItems.push({ producto, cantidad });
    }
    
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(productoId: number) {
    this.cartItems = this.cartItems.filter(item => item.producto.id !== productoId);
    this.cartSubject.next([...this.cartItems]);
  }

  updateQuantity(productoId: number, cantidad: number) {
    const item = this.cartItems.find(item => item.producto.id === productoId);
    if (item) {
      item.cantidad = cantidad;
      if (item.cantidad <= 0) {
        this.removeFromCart(productoId);
      } else {
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.cantidad, 0);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next([...this.cartItems]);
  }
}
