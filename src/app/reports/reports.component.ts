import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  selectedYear: number = new Date().getFullYear(); // Año actual
  selectedMonth: string = `${this.selectedYear}-${('0' + (new Date().getMonth() + 1)).slice(-2)}`; // Mes actual en formato "YYYY-MM"
  selectedWeek: number = 1; // Semana inicial
  selectedReportType: 'monthly' | 'weekly' = 'monthly'; // Tipo de informe inicial
  reservations: any[] = []; // Todas las reservas
  filteredReservations: any[] = []; // Reservas filtradas
  totalCost: number = 0; // Costo total calculado
  currentYear: number = new Date().getFullYear(); // Año actual

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadReservas(); // Cargar las reservas al iniciar el componente
  }

  // Método para cargar las reservas desde el backend
  loadReservas(): void {
    this.authService.getReservas().subscribe(
      (data) => {
        console.log('Reservas obtenidas:', data);
        this.reservations = data;
        this.fetchReport(); // Aplicar filtro una vez obtenidas las reservas
      },
      (error) => {
        console.error('Error al cargar las reservas:', error);
      }
    );
  }

  // Filtrar reservas según el tipo seleccionado y calcular el costo total
  fetchReport(): void {
    console.log('Generando informe:', {
      year: this.selectedYear,
      month: this.selectedMonth,
      week: this.selectedWeek,
      type: this.selectedReportType,
    });

    if (this.selectedReportType === 'monthly') {
      this.filteredReservations = this.reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.fecha); // Ajuste: utiliza "fecha" en minúsculas
        return (
          reservationDate.getFullYear() === this.selectedYear &&
          reservationDate.getMonth() ===
            parseInt(this.selectedMonth.split('-')[1], 10) - 1
        );
      });
    } else if (this.selectedReportType === 'weekly') {
      const selectedMonthIndex =
        parseInt(this.selectedMonth.split('-')[1], 10) - 1;
      this.filteredReservations = this.reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.fecha); // Ajuste: utiliza "fecha" en minúsculas
        const reservationWeek = this.getWeekNumber(reservationDate);
        return (
          reservationDate.getFullYear() === this.selectedYear &&
          reservationDate.getMonth() === selectedMonthIndex &&
          reservationWeek === this.selectedWeek
        );
      });
    }

    this.totalCost = this.filteredReservations.length * 30000; // 30000 COP por reserva
  }

  // Obtener el número de la semana basado en la fecha
  private getWeekNumber(date: Date): number {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const pastDaysOfMonth =
      (date.getTime() - firstDayOfMonth.getTime()) / 86400000;
    return Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7);
  }

  // Navegar a la página de reservas
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
