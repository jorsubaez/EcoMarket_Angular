import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  contactoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    motivo: new FormControl('Información general'),
    mensaje: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.contactoForm.valid) {
      console.log('Formulario listo para enviar a Django:', this.contactoForm.value);
      // Cuando tengas el servicio del backend, lo llamarás aquí.
      // Por ahora, reseteamos el formulario al enviarlo:
      this.contactoForm.reset({ motivo: 'Información general' });
    }
  }
}
