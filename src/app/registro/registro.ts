import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  passwordVisible = false;

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
