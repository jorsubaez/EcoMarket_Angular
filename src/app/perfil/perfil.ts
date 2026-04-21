import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/usuarios';

  protected loading = true;
  protected accessDenied = false;
  protected editing = false;
  protected saving = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected readonly sidebarItems = [
    'Mi perfil',
    'Mis pedidos',
    'Direcciones',
    'Ajustes',
    'Cerrar sesion',
  ];

  protected user: UserProfile = {
    id: '',
    nombre: 'Usuario EcoMarket',
    email: 'email@ejemplo.com',
    rol: 'cliente',
    telefono: '',
    direccion: '',
  };

  protected readonly profileForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.maxLength(20)]],
    direccion: ['', [Validators.maxLength(160)]],
  });

  async ngOnInit(): Promise<void> {
    const session = this.getSession();

    if (!session) {
      this.accessDenied = true;
      this.loading = false;
      return;
    }

    this.user = {
      id: session.id,
      nombre: session.name || 'Usuario EcoMarket',
      email: session.email || 'email@ejemplo.com',
      rol: session.rol || 'cliente',
      telefono: '',
      direccion: '',
    };

    this.syncFormWithUser();
    await this.loadUserDetails();
  }

  protected get avatarInitials(): string {
    const parts = this.user.nombre
      .split(' ')
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'UE';
  }

  protected get roleLabel(): string {
    switch (this.user.rol) {
      case 'productor':
        return 'Cuenta de productor';
      case 'cliente':
        return 'Cuenta de cliente';
      default:
        return 'Cuenta EcoMarket';
    }
  }

  protected get displayPhone(): string {
    return this.user.telefono?.trim() || 'No especificado';
  }

  protected get displayAddress(): string {
    return this.user.direccion?.trim() || 'Anade una direccion principal';
  }

  protected beginEdit(): void {
    this.clearMessages();
    this.editing = true;
    this.syncFormWithUser();
  }

  protected cancelEdit(): void {
    this.editing = false;
    this.clearMessages();
    this.syncFormWithUser();
  }

  protected async saveProfile(): Promise<void> {
    this.clearMessages();

    if (this.profileForm.invalid || !this.user.id) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = {
      nombre: this.profileForm.controls.nombre.value.trim(),
      email: this.profileForm.controls.email.value.trim(),
      telefono: this.profileForm.controls.telefono.value.trim(),
      direccion: this.profileForm.controls.direccion.value.trim(),
    };

    this.saving = true;

    try {
      const updatedUser = await firstValueFrom(
        this.http.patch<UserProfile>(`${this.apiUrl}/${this.user.id}`, payload),
      );

      this.user = {
        ...this.user,
        ...updatedUser,
      };

      this.writeSession({
        id: this.user.id,
        name: this.user.nombre,
        email: this.user.email,
        rol: this.user.rol,
      });

      this.syncFormWithUser();
      this.editing = false;
      this.successMessage = 'Perfil actualizado correctamente.';
    } catch {
      this.errorMessage =
        'No se pudo guardar el perfil. Comprueba que json-server este funcionando en http://localhost:3000.';
    } finally {
      this.saving = false;
    }
  }

  protected handleSidebarAction(item: string): void {
    this.clearMessages();

    if (item === 'Cerrar sesion') {
      localStorage.removeItem('ecomarket_session');
      this.accessDenied = true;
      this.editing = false;
      this.successMessage = 'Sesion cerrada. La redireccion real la conectara Persona 3.';
      return;
    }

    this.successMessage = `"${item}" queda como acceso visual por ahora para no pisar rutas de otros companeros.`;
  }

  private async loadUserDetails(): Promise<void> {
    this.loading = true;
    this.clearMessages();

    try {
      const remoteUser = await firstValueFrom(
        this.http.get<UserProfile>(`${this.apiUrl}/${this.user.id}`),
      );

      this.user = {
        ...this.user,
        ...remoteUser,
      };
      this.syncFormWithUser();
    } catch {
      this.errorMessage =
        'No se pudieron cargar los detalles completos del perfil. Se muestran los datos de la sesion local.';
    } finally {
      this.loading = false;
    }
  }

  private syncFormWithUser(): void {
    this.profileForm.reset({
      nombre: this.user.nombre || '',
      email: this.user.email || '',
      telefono: this.user.telefono || '',
      direccion: this.user.direccion || '',
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private getSession(): Session | null {
    try {
      const raw = localStorage.getItem('ecomarket_session');
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }

  private writeSession(session: Session): void {
    localStorage.setItem('ecomarket_session', JSON.stringify(session));
  }
}

interface Session {
  id: number | string;
  name: string;
  email?: string;
  rol?: string;
}

interface UserProfile {
  id: number | string;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  direccion?: string;
}
