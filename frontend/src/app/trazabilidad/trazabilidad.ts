import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../services/product.service';

interface TrazabilidadProducto {
  id: number;
  nombre: string;
  origen: string;
  lote?: string | null;
  finca_origen?: string | null;
  fecha_cosecha?: string | null;
  certificado?: string | null;
  productor?: string | null;
}

@Component({
  selector: 'app-trazabilidad',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trazabilidad.html',
  styleUrl: './trazabilidad.css',
})
export class TrazabilidadComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected loading = true;
  protected errorMessage = '';
  protected producto: TrazabilidadProducto | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.errorMessage = 'No se ha encontrado el producto solicitado.';
      return;
    }

    this.productService.getTrazabilidadProducto(id).subscribe({
      next: (producto) => {
        this.producto = producto as unknown as TrazabilidadProducto;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la trazabilidad del producto.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
