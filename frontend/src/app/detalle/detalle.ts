import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Review, ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';

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

  // HU13 - Trazabilidad / QR
  qrUrl?: string;
  lote?: string;
  fincaOrigen?: string;
  fechaCosecha?: string;
  certificateUrl?: string;

  // HU16 - Reseñas
  averageRating?: number;
  reviewsCount?: number;
}

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {
  private route = inject(ActivatedRoute);

  producto: Producto | undefined;
  loading = true;

  reviews: Review[] = [];
  newRating = 5;
  newComment = '';
  reviewMessage = '';
  reviewError = '';

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ? Number(idParam) : 1;
    this.cargarProducto(id);
  }

  cargarProducto(id: number) {
    this.loading = true;

    this.http.get<any>(`http://localhost:8000/api/productos/${id}/`).subscribe({
      next: (item) => {
        this.producto = {
          id: item.id,
          nombre: item.name,
          origen: item.origin,
          productor: item.ownerName || 'Productor Anónimo',
          precio: parseFloat(item.price),
          unidad: item.unit,
          disponibilidad: item.quantity,
          imagenUrl: item.image_url || item.image_url_legacy || 'assets/images/placeholder.png',
          tieneEcoSello: true,
          descripcion: item.description || '',

          // HU13 - Trazabilidad / QR
          qrUrl: item.qr_url || item.qrUrl || '',
          lote: item.lote || '',
          fincaOrigen: item.finca_origen || item.fincaOrigen || '',
          fechaCosecha: item.fecha_cosecha || item.fechaCosecha || '',
          certificateUrl: item.certificate_url || item.certificateUrl || '',

          // HU16 - Reseñas
          averageRating: Number(item.average_rating || item.averageRating || 0),
          reviewsCount: Number(item.reviews_count || item.reviewsCount || 0),
        };

        this.cargarReviews(item.id);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  agregarAlCarrito(cantidadInput: string) {
    if (this.producto) {
      const cantidad = parseInt(cantidadInput, 10) || 1;
      this.cartService.addToCart(this.producto, cantidad);
    }
  }

  async cargarReviews(productId: number) {
    try {
      this.reviews = await this.reviewService.getReviewsByProduct(productId);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error cargando reseñas', err);
    }
  }

  async enviarReview() {
    if (!this.producto) {
      return;
    }

    this.reviewMessage = '';
    this.reviewError = '';

    try {
      await this.reviewService.createReview(
        this.producto.id,
        Number(this.newRating),
        this.newComment,
      );

      this.reviewMessage = 'Reseña enviada correctamente.';
      this.newRating = 5;
      this.newComment = '';

      await this.cargarReviews(this.producto.id);
      this.cargarProducto(this.producto.id);
    } catch (err: any) {
      console.error('Error enviando reseña', err);

      if (err?.error?.detail) {
        this.reviewError = err.error.detail;
      } else if (err?.error?.non_field_errors) {
        this.reviewError = 'Ya has escrito una reseña para este producto.';
      } else {
        this.reviewError = 'No se pudo enviar la reseña.';
      }
    }

    this.cdr.detectChanges();
  }
}
