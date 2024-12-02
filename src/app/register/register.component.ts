import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de incluir esto

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Agrega HttpClientModule aquí
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const customerData = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
    };

    this.authService.register(customerData).subscribe(
      (response: any) => {
        console.log('Cliente registrado con éxito', response);
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error al registrar cliente', error);
        this.errorMessage = 'Ocurrió un error durante el registro.';
      }
    );
  }
}
