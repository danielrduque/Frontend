import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/users'; // URL del backend para Customer
  private reservaUrl = 'http://localhost:3001/reservas'; // URL del backend para Reservas
  baseUrl: any;

  constructor(private http: HttpClient) {}

  // Método para registrar un cliente
  register(customerData: any): Observable<any> {
    return this.http.post(this.apiUrl, customerData);
  }

  // Método para iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Método para crear una reserva
  createReserva(reservaData: any): Observable<any> {
    return this.http.post(this.reservaUrl, reservaData); // Envía los datos de reserva al backend
  }

  // Método para obtener todas las reservas
  getReservas(): Observable<any> {
    return this.http.get(this.reservaUrl).pipe(
      tap((reservas) => {
        console.log('Reservas desde el backend:', reservas); // Log para verificar los datos
      })
    ); // Obtiene las reservas desde el backend
  }
  // Obtener las reservas para el reporte
  getReservations(year: number, month: string, week?: number): Observable<any[]> {
    let url = `${this.baseUrl}?year=${year}&month=${month}`;
    if (week) {
      url += `&week=${week}`;
    }
    return this.http.get<any[]>(url);
  }
}
