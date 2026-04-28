import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class Catalogo {
  // Datos simulados basados en tu mockup para ir trabajando la vista
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Tomates',
      origen: 'Gran Canaria',
      productor: 'Ana Productora',
      precio: 4.0,
      unidad: 'kg',
      disponibilidad: 100,
      imagenUrl: 'assets/images/tomate.png', // Ajusta esta ruta a tus imágenes reales
      tieneEcoSello: true,
      descripcion: 'Deliciosos tomates cultivados de forma 100% ecológica, sin pesticidas ni químicos artificiales. Madurados al sol, son ideales para ensaladas, gazpachos y salsas caseras.',
    },
    {
      id: 2,
      nombre: 'Naranjas ecológicas',
      origen: 'Gran Canaria',
      productor: 'Ana Productora',
      precio: 2.5,
      unidad: 'kg',
      disponibilidad: 150,
      imagenUrl: 'assets/images/naranja.png',
      tieneEcoSello: true,
      descripcion: 'Naranjas dulces y jugosas, ricas en vitamina C. Cultivadas localmente y recolectadas en su punto óptimo de maduración para garantizar el mejor sabor.',
    },
    {
      id: 3,
      nombre: 'Plátanos ecológicos',
      origen: 'Gran Canaria',
      productor: 'Ana Productora',
      precio: 1.8,
      unidad: 'kg',
      disponibilidad: 200,
      imagenUrl: 'assets/images/platano.png',
      tieneEcoSello: true,
      descripcion: 'Plátanos de Canarias con denominación de origen. Sabor intenso y textura perfecta. Ideal como snack saludable lleno de energía.',
    },
    {
      id: 4,
      nombre: 'Lechugas orgánicas',
      origen: 'Galicia',
      productor: 'Carlos Agricultor',
      precio: 1.5,
      unidad: 'pack',
      disponibilidad: 120,
      imagenUrl: 'assets/images/lechuga.png',
      tieneEcoSello: true,
      descripcion: 'Lechugas orgánicas frescas y crujientes, cultivadas sin químicos. La base perfecta para cualquier ensalada saludable.',
    },
  ];

  selectedProducto: Producto | null = null;

  constructor(private cartService: CartService) {}

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
