import {Component,ElementRef,Inject,Input,ViewChild,OnDestroy,AfterViewInit,ChangeDetectorRef,OnChanges,SimpleChanges} from '@angular/core';
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
export class CourseList implements AfterViewInit, OnDestroy, OnChanges {
  @Input() title: string = "Cursos destacados";
  @Input() courseList: Course[] = [];
  @Input() username: string = '';
  @Input() isFavorites: boolean = false;

  private _carouselTrack?: ElementRef;
  
  @ViewChild('carouselTrack', { static: false }) 
  set carouselTrack(el: ElementRef | undefined) {
    this._carouselTrack = el;
    if (el && isPlatformBrowser(this.platformId)) {
      this.setupTrackObservers(el.nativeElement);
    }
  }
  
  get carouselTrack(): ElementRef | undefined {
    return this._carouselTrack;
  }

  hasOverflow = false;
  currentIndex = 0;
  visibleItems = 1;
  totalPages = 0;
  private viewReady = false;
  private observersSetup = false;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private destroyed = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.viewReady = true;
    
    // Si el track ya está disponible, configurar observers
    if (this._carouselTrack) {
      this.setupTrackObservers(this._carouselTrack.nativeElement);
    }
  }

  private setupTrackObservers(track: HTMLElement) {
    if (this.observersSetup || !isPlatformBrowser(this.platformId)) return;
    this.observersSetup = true;

    // Esperar 2 frames para asegurar que todo está renderizado
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

    // También escucha resize global
    window.addEventListener('resize', this.onWindowResize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseList']) {
      // Resetear observers si cambia la lista (el track puede re-renderizarse)
      this.observersSetup = false;
      this.currentIndex = 0;
      
      // Recalcular cuando cambien los cursos
      setTimeout(() => {
        if (this._carouselTrack) {
          this.setupTrackObservers(this._carouselTrack.nativeElement);
          this.checkOverflow(this._carouselTrack.nativeElement);
        }
      });
    }
  }

  private onWindowResize = () => {
    if (!this._carouselTrack) return;
    this.checkOverflow(this._carouselTrack.nativeElement);
  };

  scrollLeft() {
    if (!this._carouselTrack) return;
    const track = this._carouselTrack.nativeElement;
    const itemWidth = this.getItemWidth();
    
    if (this.currentIndex > 0) {
      this.currentIndex--;
      track.scrollTo({ left: itemWidth * this.currentIndex * this.visibleItems, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (!this._carouselTrack) return;
    const track = this._carouselTrack.nativeElement;
    const itemWidth = this.getItemWidth();
    const maxIndex = Math.ceil(this.courseList.length / this.visibleItems) - 1;
    
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      track.scrollTo({ left: itemWidth * this.currentIndex * this.visibleItems, behavior: 'smooth' });
    }
  }

  private getItemWidth(): number {
    if (!this._carouselTrack || !isPlatformBrowser(this.platformId)) return 280;
    const track = this._carouselTrack.nativeElement;
    const firstItem = track.querySelector('.carousel-item') as HTMLElement;
    if (!firstItem) return 280;
    
    const itemWidth = firstItem.offsetWidth;
    // Incluir el gap horizontal del contenedor flex para medir el paso real
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat((trackStyles as any).columnGap || trackStyles.gap || '0');
    return itemWidth + (isNaN(gap) ? 0 : gap);
  }

  goToSlide(index: number) {
    if (!this._carouselTrack) return;
    this.currentIndex = index;
    const track = this._carouselTrack.nativeElement;
    const itemWidth = this.getItemWidth();
    track.scrollTo({ left: itemWidth * index * this.visibleItems, behavior: 'smooth' });
  }

  get dots(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  // Tolerancia para evitar falsos positivos por 1-2px (scrollbars, padding, redondeo)
  checkOverflow(track: HTMLElement) {
    if (this.destroyed || !isPlatformBrowser(this.platformId)) return;
    const diff = track.scrollWidth - track.clientWidth;
    const tolerance = 3; // px

    // Calcular items visibles y total de páginas
    const itemWidth = this.getItemWidth();
    const prevTotalPages = this.totalPages;
    
    if (itemWidth > 0) {
      this.visibleItems = Math.max(1, Math.floor(track.clientWidth / itemWidth));
      this.totalPages = Math.max(1, Math.ceil(this.courseList.length / this.visibleItems));
    }

    const overflowByWidth = diff > tolerance;
    const overflowByCount = this.courseList.length > this.visibleItems;
    const overflowNow = overflowByWidth || overflowByCount;

    // Forzar detección si cambió overflow o totalPages
    if (overflowNow !== this.hasOverflow || this.totalPages !== prevTotalPages) {
      this.hasOverflow = overflowNow;
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
