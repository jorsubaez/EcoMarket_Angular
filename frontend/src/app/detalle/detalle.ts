import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Usamos la misma estructura del catálogo, pero le añadimos una descripción
export interface Producto {
  id: number;
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
  producto: Producto | undefined;

  ngOnInit() {
    // Obtenemos el ID de la URL
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ? Number(idParam) : 1;

    // Simulamos la búsqueda. En el futuro, esto será una llamada al backend en Python
    this.cargarProducto(id);
  }

  cargarProducto(id: number) {
    // Datos simulados para que puedas ver el diseño
    const productosMock: Producto[] = [
      {
        id: 1,
        nombre: 'Tomates',
        origen: 'Gran Canaria',
        productor: 'Ana Productora',
        precio: 4.0,
        unidad: 'kg',
        disponibilidad: 100,
        imagenUrl: 'assets/images/tomate.png',
        tieneEcoSello: true,
        descripcion:
          'Deliciosos tomates cultivados de forma 100% ecológica, sin pesticidas ni químicos artificiales. Madurados al sol, son ideales para ensaladas, gazpachos y salsas caseras. Al comprar este producto apoyas directamente a la agricultura local.',
      },
    ];

    this.producto = productosMock.find((p) => p.id === id) || productosMock[0];
  }

  agregarAlCarrito(cantidadInput: string) {
    if (this.producto) {
      const cantidad = parseInt(cantidadInput, 10) || 1;
      console.log(`Listo para Django: Añadir ${cantidad} de ${this.producto.nombre} al carrito`);
    }
  }
}
