import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService, ApiProduct } from '../services/product.service';

export interface Producto {
  id: string | number;
  nombre: string;
  origen: string;
  productor: string;
  precio: number;
  unidad: string;
  disponibilidad: number;
  imagenUrl: string;
  tieneEcoSello: boolean;
  descripcion?: string;
}

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  producto: Producto | undefined;
  loading = true;

  ngOnInit() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ? idParam : '1';
    this.cargarProducto(id);
  }

  cargarProducto(id: string) {
    this.loading = true;
    
    // We get the products from the service instead of an HTTP call directly
    this.productService.products$.subscribe({
      next: (products: ApiProduct[]) => {
        const item = products.find(p => String(p.id) === id);
        if (item) {
          this.producto = {
            id: item.id,
            nombre: item.name,
            origen: item.origin,
            productor: item.ownerName || 'Productor Anónimo',
            precio: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            unidad: item.unit,
            disponibilidad: item.quantity,
            imagenUrl: item.image_url || item.image_url_legacy || item.image || 'assets/images/placeholder.png',
            tieneEcoSello: !!(item.certificate_url || item.certificate),
            descripcion: item.description || ''
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Make sure we trigger a fetch if the BehaviorSubject is empty
    this.productService.refreshProducts();
  }

  agregarAlCarrito(cantidadInput: string) {
    if (this.producto) {
      const cantidad = parseInt(cantidadInput, 10) || 1;
      this.cartService.addToCart(this.producto, cantidad);
    }
  }
}
