import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';

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

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8000/api/productos/').subscribe({
      next: (data) => {
        this.productos = data.map(item => ({
          id: item.id,
          nombre: item.name,
          origen: item.origin,
          productor: item.ownerName || 'Productor Anónimo',
          precio: parseFloat(item.price),
          unidad: item.unit,
          disponibilidad: item.quantity,
          imagenUrl: item.image_url || item.image_url_legacy || 'assets/images/placeholder.png',
          tieneEcoSello: true,
          descripcion: item.description || ''
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading = false;
      }
    });
  }

  abrirModal(producto: Producto) {
    this.selectedProducto = producto;
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
  }

  cerrarModal() {
    this.selectedProducto = null;
    document.body.style.overflow = 'auto';
  }

  agregarAlCarrito(producto: Producto, cantidadInput: string) {
    const cantidad = parseInt(cantidadInput, 10) || 1;
    this.cartService.addToCart(producto, cantidad);
    console.log(`Añadidos ${cantidad} de ${producto.nombre} al carrito mediante CartService`);
    this.cerrarModal();
  }
}
