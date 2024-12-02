import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
})
export class ReservaComponent implements OnInit {
  activeTab: string = 'restricciones';
  private readonly _authService: AuthService = inject(AuthService);

  nuevaReserva = {
    nombre: '',
    fecha: '',
    hora: '',
  };

  horasDisponibles: string[] = [];
  reservas: Array<{
    nombre: string;
    fecha: string;
    hora: string;
    horaFin: string;
  }> = [];
  mensajeError: string = '';

  constructor(private router: Router) {
    this.generarHorasDisponibles();
  }

  ngOnInit(): void {
    this.obtenerReservas(); // Carga las reservas al inicializar el componente
  }

  // Método para obtener las reservas desde el backend
  obtenerReservas(): void {
    this._authService.getReservas().subscribe(
      (reservas: any[]) => {
        console.log('Reservas obtenidas:', reservas); // Verifica si las reservas se obtienen correctamente

        const fechaHoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
        
        // Filtra las reservas para que solo se muestren las de hoy en adelante
        this.reservas = reservas
          .filter(reserva => reserva.fecha >= fechaHoy) // Comparar fechas (reservas de hoy en adelante)
          .map(reserva => ({
            nombre: reserva.nombre,
            fecha: reserva.fecha,
            hora: reserva.hora,
            horaFin: this.getHoraFin(reserva.hora),
          }));
      },
      (error) => {
        console.error('Error al cargar reservas:', error);
        this.mensajeError = '⚠️ Error al cargar las reservas. Intenta de nuevo. ⚠️';
      }
    );
  }

  // Método para cambiar la pestaña activa
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // Método para generar las horas disponibles entre 6 AM y 11 PM
  generarHorasDisponibles(): void {
    const inicio = 6; // 6 AM
    const fin = 23; // 11 PM

    for (let i = inicio; i <= fin; i++) {
      const hora = i < 10 ? `0${i}:00` : `${i}:00`;
      this.horasDisponibles.push(hora);
    }
  }

  // Método para verificar si la hora está ocupada
  isHoraOcupada(hora: string): boolean {
    return this.reservas.some(reserva => reserva.hora === hora && reserva.fecha === this.nuevaReserva.fecha);
  }

  // Método para agregar una nueva reserva
  agregarReserva(): void {
    if (
      this.nuevaReserva.nombre &&
      this.nuevaReserva.fecha &&
      this.nuevaReserva.hora
    ) {
      if (this.isHoraOcupada(this.nuevaReserva.hora)) {
        this.mensajeError =
          '⚠️ Cancha reservada para esta fecha y hora. Elija otro horario. ⚠️';
      } else {
        const horaFin = this.getHoraFin(this.nuevaReserva.hora);

        // Crear la reserva en el backend
        this._authService.createReserva(this.nuevaReserva).subscribe(
          () => {
            // Refrescar la lista de reservas después de agregar una nueva
            this.obtenerReservas();
            this.mensajeError = '';
            this.nuevaReserva = { nombre: '', fecha: '', hora: '' };
          },
          (error) => {
            console.error('Error al crear reserva:', error);
            this.mensajeError =
              '⚠️ Hubo un error al crear la reserva. Inténtalo de nuevo. ⚠️';
          }
        );
      }
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }

  // Método para calcular la hora de fin de una reserva (1 hora después de la hora de inicio)
  getHoraFin(horaInicio: string): string {
    const [hora, minutos] = horaInicio.split(':').map(Number);
    let horaFin = (hora + 1) % 24;
    const formatoFin = horaFin >= 12 ? 'PM' : 'AM';

    const horaFin12 = horaFin % 12 || 12;
    return `${horaFin12}:${minutos === 0 ? '00' : minutos} ${formatoFin}`;
  }

  // Método para navegar a la sección de reservas en la interfaz
  navigateToReservas(): void {
    this.router.navigate(['/reserva']).then(() => {
      const element = document.getElementById('reservas-actuales');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    });
  }
}
