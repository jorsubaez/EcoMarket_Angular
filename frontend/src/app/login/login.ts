import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  passwordVisible = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit() {
    try {
      const response = await fetch('http://localhost:3000/usuarios');

      if (!response.ok) {
        throw new Error('No se pudo conectar con json-server');
      }

      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find((usuario: any) =>
        usuario.email === this.email && usuario.password === this.password
      );

      if (usuarioEncontrado) {
        const sessionData = {
          id: usuarioEncontrado.id,
          name: usuarioEncontrado.nombre,
          email: usuarioEncontrado.email,
          rol: usuarioEncontrado.rol
        };

        localStorage.setItem("ecomarket_session", JSON.stringify(sessionData));

        if (usuarioEncontrado.rol === "productor") {
          this.router.navigate(['/panel-productor']);
        } else {
          this.router.navigate(['/perfil']);
        }
      } else {
        alert("Email o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al conectar con json-server:", error);
      alert("No se pudo iniciar sesión.");
    }
  }
}
