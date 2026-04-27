import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    },
  ];

  agregarAlCarrito(producto: Producto, cantidadInput: string) {
    const cantidad = parseInt(cantidadInput, 10) || 1;
    console.log(`Se enviará a Django: Añadir ${cantidad} de ${producto.nombre} al carrito`);
    // Aquí irá la lógica para el servicio del carrito
  }
}
