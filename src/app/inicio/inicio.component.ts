import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';  // Importar el Router

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit {

  currentSlide = 0;
  slides: HTMLElement[] = [];

  // Inyectar el Router en el constructor
  constructor(private router: Router) { }

  ngAfterViewInit() {
    // Asegúrate de que este código solo se ejecute en el navegador
    if (typeof document !== 'undefined') {
      this.slides = Array.from(document.querySelectorAll('.carousel-item')) as HTMLElement[];
      this.updateSlidePosition();
    }
  }

  nextSlide() {
    if (this.slides.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.updateSlidePosition();
    }
  }

  prevSlide() {
    if (this.slides.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.updateSlidePosition();
    }
  }

  updateSlidePosition() {
    this.slides.forEach((slide, index) => {
      // Cambia la posición de las imágenes del carrusel
      slide.style.transform = `translateX(${(index - this.currentSlide) * 100}%)`;
    });
  }

  // Método para redirigir al Login cuando se presiona el botón
  iniciarSesion() {
    this.router.navigate(['/login']);  // Redirige a la página de login
  }
}
