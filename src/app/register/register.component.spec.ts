import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = ''; // Nueva variable para el correo electrónico
  phone: string = ''; // Nueva variable para el número de teléfono
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
    } else {
      // Aquí puedes añadir lógica adicional para procesar el correo y el teléfono si es necesario
      // Redirigir a otra página después del registro
      this.router.navigate(['/login']);
    }
  }
}
