import {Component,ElementRef,Inject,Input,ViewChild,OnDestroy,AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { CourseCard } from "../course-card/course-card";
import { Course } from '../../../../core/models/course.model';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements AfterViewInit, OnDestroy {
  @Input() title: string = "Cursos destacados";
  @Input() courseList: Course[] = [];
  @Input() username: string = '';
  @Input() isFavorites: boolean = false;

  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;

  hasOverflow = false;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private destroyed = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const track: HTMLElement = this.carouselTrack.nativeElement;

    // Esperar 2 frames para asegurar que todo está renderizado (items + estilos)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.checkOverflow(track);
      });
    });

    // Observador para cambios de tamaño (responsive)
    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverflow(track);
    });
    this.resizeObserver.observe(track);

    // Observador para cuando los items cambien (carga asíncrona, ngIf, etc.)
    this.mutationObserver = new MutationObserver(() => {
      this.checkOverflow(track);
    });
    this.mutationObserver.observe(track, { childList: true, subtree: true });

    // También escucha resize global (opcional)
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onWindowResize);
    }

  }

  private onWindowResize = () => {
    if (!this.carouselTrack) return;
    this.checkOverflow(this.carouselTrack.nativeElement);
  };

  scrollLeft() {
    if (!this.carouselTrack) return;
    this.carouselTrack.nativeElement.scrollBy({ left: -280, behavior: 'smooth' });
  }

  scrollRight() {
    if (!this.carouselTrack) return;
    this.carouselTrack.nativeElement.scrollBy({ left: 280, behavior: 'smooth' });
  }

  // Tolerancia para evitar falsos positivos por 1-2px (scrollbars, padding, redondeo)
  checkOverflow(track: HTMLElement) {
    if (this.destroyed) return;
    const diff = track.scrollWidth - track.clientWidth;
    const tolerance = 3; // px
    const overflowNow = diff > tolerance;

    if (overflowNow !== this.hasOverflow) {
      this.hasOverflow = overflowNow;
      // forzar detección para actualizar la plantilla inmediatamente
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroyed = true;

    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();

    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

}
