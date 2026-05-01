import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService, ApiProduct } from '../services/product.service';

// Definimos la estructura de datos que esperamos de Django
export interface Producto {
  id: number;
  nombre: string;
  origen: string;
  productor: string;
  precio: number;
  unidad: string; // ej: 'kg', 'pack', 'unidad'
  disponibilidad: number;
  imagenUrl: string;
  tieneEcoSello: boolean;
  descripcion?: string;
  certificadoUrl?: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  productos: Producto[] = [];
  selectedProducto: Producto | null = null;
  loading = true;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 1. Suscribirse a la caché instantánea
    this.productService.products$.subscribe((data: ApiProduct[]) => {
      this.productos = data.map(item => ({
        id: item.id,
        nombre: item.name,
        origen: item.origin,
        productor: item.ownerName || 'Productor Anónimo',
        precio: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        unidad: item.unit,
        disponibilidad: item.quantity,
        imagenUrl: item.image_url || item.image_url_legacy || 'assets/images/placeholder.png',
        tieneEcoSello: !!item.certificate_url,
        descripcion: item.description || '',
        certificadoUrl: item.certificate_url
      }));
      this.loading = false;
      this.cdr.detectChanges();
    });

    // 2. Disparar recarga de fondo
    this.productService.refreshProducts();
  }

  abrirModal(producto: Producto) {
    this.selectedProducto = producto;
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
  }

  cerrarModal() {
    this.selectedProducto = null;
    document.body.style.overflow = 'auto';
  }

  formatUnidadPrecio(unidad: string): string {
    if (!unidad) {
      return '';
    }

    return unidad.startsWith('EUR/') ? unidad.replace('EUR/', '€/') : `€/${unidad}`;
  }

  agregarAlCarrito(producto: Producto, cantidadInput: string) {
    const cantidad = parseInt(cantidadInput, 10) || 1;
    this.cartService.addToCart(producto, cantidad);
    console.log(`Añadidos ${cantidad} de ${producto.nombre} al carrito mediante CartService`);
    this.cerrarModal();
  }
}
