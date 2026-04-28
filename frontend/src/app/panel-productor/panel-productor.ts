import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-panel-productor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-productor.html',
  styleUrl: './panel-productor.css',
})
export class PanelProductor implements OnInit {
  @ViewChild('imageInput') imageInput?: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/productos';
  private readonly placeholderImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
        <rect width="320" height="200" rx="18" fill="#edf7ee"/>
        <circle cx="108" cy="82" r="26" fill="#9ccc9f"/>
        <path d="M44 160c18-34 44-50 78-50 28 0 53 14 76 43 11-13 26-20 43-20 29 0 53 17 70 27v0H44z" fill="#58a55c"/>
        <text x="160" y="182" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#2f6f35">EcoMarket</text>
      </svg>
    `);

  protected sessionName = 'Productor';
  protected accessDenied = false;
  protected loading = true;
  protected submitting = false;
  protected searchTerm = '';
  protected successMessage = '';
  protected errorMessage = '';
  protected selectedFileName = 'Ningun archivo seleccionado';
  protected editingProductId: number | string | null = null;
  protected products: Product[] = [];

  protected readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    origin: ['', [Validators.required, Validators.maxLength(80)]],
    price: [0, [Validators.required, Validators.min(0)]],
    unit: ['EUR/kg', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  private selectedImageDataUrl = '';
  private ownerId: number | string | null = null;

  async ngOnInit(): Promise<void> {
    const session = this.getSession();

    if (!session || session.rol !== 'productor') {
      this.accessDenied = true;
      this.loading = false;
      return;
    }

    this.sessionName = session.name || 'Productor';
    this.ownerId = session.id;

    await this.loadProducts();
  }

  protected get filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.products;
    }

    return this.products.filter((product) => product.name.toLowerCase().includes(query));
  }

  protected get isEditing(): boolean {
    return this.editingProductId !== null;
  }

  protected updateSearch(term: string): void {
    this.searchTerm = term;
  }

  protected async submitProduct(): Promise<void> {
    this.clearMessages();

    if (this.productForm.invalid || this.ownerId === null) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const formValue = this.productForm.getRawValue();
    const payload: Partial<Product> = {
      ownerId: this.ownerId,
      ownerName: this.sessionName,
      name: formValue.name.trim(),
      origin: formValue.origin.trim(),
      price: Number(formValue.price),
      unit: formValue.unit,
      description: formValue.description.trim(),
      quantity: Number(formValue.quantity),
    };

    if (this.selectedImageDataUrl) {
      payload.image = this.selectedImageDataUrl;
    }

    try {
      if (this.editingProductId !== null) {
        const updated = await firstValueFrom(
          this.http.patch<Product>(`${this.apiUrl}/${this.editingProductId}`, payload),
        );

        this.products = this.products.map((product) =>
          String(product.id) === String(this.editingProductId) ? updated : product,
        );
        this.successMessage = 'Producto actualizado correctamente.';
      } else {
        const created = await firstValueFrom(this.http.post<Product>(this.apiUrl, payload));
        this.products = [created, ...this.products];
        this.successMessage = 'Producto anadido correctamente.';
      }

      this.resetForm();
    } catch {
      this.errorMessage =
        'No se pudo guardar el producto. Comprueba que json-server este funcionando en http://localhost:3000.';
    } finally {
      this.submitting = false;
    }
  }

  protected editProduct(product: Product): void {
    this.clearMessages();
    this.editingProductId = product.id ?? null;
    this.selectedImageDataUrl = product.image || '';
    this.selectedFileName = product.image ? 'Imagen actual' : 'Ningun archivo seleccionado';
    this.productForm.setValue({
      name: product.name ?? '',
      origin: product.origin ?? '',
      price: Number(product.price ?? 0),
      unit: product.unit ?? 'EUR/kg',
      description: product.description ?? '',
      quantity: Number(product.quantity ?? 0),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected async deleteProduct(product: Product): Promise<void> {
    if (!product.id) {
      return;
    }

    const confirmed = window.confirm(
      `Vas a eliminar "${product.name}". Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${product.id}`));
      this.products = this.products.filter((item) => String(item.id) !== String(product.id));

      if (String(this.editingProductId) === String(product.id)) {
        this.resetForm();
      }

      this.successMessage = 'Producto eliminado correctamente.';
    } catch {
      this.errorMessage = 'No se pudo eliminar el producto.';
    }
  }

  protected cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  protected async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      this.selectedFileName = this.isEditing ? 'Imagen actual' : 'Ningun archivo seleccionado';
      this.selectedImageDataUrl = this.editingProductPreview;
      return;
    }

    this.selectedFileName = file.name;
    this.selectedImageDataUrl = await this.readFileAsDataUrl(file);
  }

  protected logout(): void {
    localStorage.removeItem('ecomarket_session');
    this.accessDenied = true;
    this.products = [];
    this.clearMessages();
    this.successMessage = 'Sesion cerrada. El guard y la redireccion los conectara Persona 3.';
  }

  protected formatPrice(value: number | string): string {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return `${value}`;
    }

    return numericValue.toFixed(2).replace('.', ',');
  }

  protected productImage(product: Product): string {
    return product.image || this.placeholderImage;
  }

  private get editingProductPreview(): string {
    if (!this.isEditing) {
      return '';
    }

    const currentProduct = this.products.find(
      (product) => String(product.id) === String(this.editingProductId),
    );

    return currentProduct?.image || '';
  }

  private getSession(): Session | null {
    try {
      const raw = localStorage.getItem('ecomarket_session');
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }

  private async loadProducts(): Promise<void> {
    this.loading = true;
    this.clearMessages();

    try {
      const allProducts = await firstValueFrom(this.http.get<Product[]>(this.apiUrl));

      this.products = allProducts.filter(
        (product) => String(product.ownerId) === String(this.ownerId),
      );
    } catch {
      this.errorMessage = 'No se pudieron cargar tus productos. Verifica la API local.';
      this.products = [];
    } finally {
      this.loading = false;
    }
  }

  private resetForm(): void {
    this.productForm.reset({
      name: '',
      origin: '',
      price: 0,
      unit: 'EUR/kg',
      description: '',
      quantity: 0,
    });
    this.editingProductId = null;
    this.selectedImageDataUrl = '';
    this.selectedFileName = 'Ningun archivo seleccionado';

    if (this.imageInput) {
      this.imageInput.nativeElement.value = '';
    }
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });
  }
}

interface Session {
  id: number | string;
  name: string;
  rol: string;
}

interface Product {
  id?: number | string;
  ownerId: number | string;
  ownerName?: string;
  name: string;
  origin: string;
  price: number;
  unit: string;
  description: string;
  quantity: number;
  image?: string;
}
