import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  passwordVisible = false;
  submitting = false;
  errorMessage = '';

  private fb = inject(FormBuilder);

  registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  });

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Revisa los campos marcados antes de continuar.';
      return;
    }

    const { password, passwordConfirm, email, first_name, last_name } = this.registerForm.value;
    if (password !== passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.registerForm.get('passwordConfirm')?.setErrors({ mismatch: true });
      this.registerForm.get('passwordConfirm')?.markAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const userData = {
      email,
      password,
      name: `${first_name} ${last_name}`
    };

    try {
      await this.authService.register(userData);
      await this.authService.login({ email, password });
      this.router.navigate(['/catalogo']);
    } catch (err: any) {
      this.submitting = false;
      this.errorMessage = 'Hubo un error al registrar tu cuenta. Puede que el email ya esté en uso.';
      console.error(err);
    }
  }
}
