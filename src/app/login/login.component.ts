import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar ngModel y formularios
import { RouterModule } from '@angular/router'; // Importar RouterModule para usar routerLink
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importamos CommonModule, FormsModule y RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';  // Cambia 'username' a 'email'
  password: string = '';  // Variable para la contraseña
  errorMessage: string = '';  // Variable para mostrar mensajes de error

  constructor(private authService: AuthService, private router: Router) {}

  // Método que se ejecuta al enviar el formulario
  onLogin() {
    const credentials = { email: this.email, password: this.password }; // Asegúrate de que sea 'email'

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.access_token);
        // Redirige a la página de reservas después de un login exitoso
        this.router.navigate(['/reserva']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
}
