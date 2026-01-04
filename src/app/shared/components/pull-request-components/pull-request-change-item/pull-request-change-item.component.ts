import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseModule } from '../../courseComponent/course-module/course-module';
import { CoursePublication } from '../../courseComponent/course-publication/course-publication';
import { PublicationContentComponent } from '../../courseComponent/course-publication/publication-content/publication-content.component';
import { environment } from '../../../../../environments/environment';

interface Change {
  id_change: number;
  id_pull_request: number;
  entity_type: string;
  entity_id: number | null;
  entity_uuid: string | null;
  action: 'ADD' | 'UPDATE' | 'DELETE';
  reason: string | null;
  old_data: any;
  new_data: any;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  date_created: string;
}

@Component({
  selector: 'app-pull-request-change-item',
  standalone: true,
  imports: [CommonModule, CourseModule, CoursePublication, PublicationContentComponent],
  templateUrl: './pull-request-change-item.component.html',
  styleUrl: './pull-request-change-item.component.css'
})
export class PullRequestChangeItemComponent {
  @Input() change!: Change;
  apiUrlBack = environment.apiUrlForStatics;

  getIcon(): string {
    switch (this.change.action) {
      case 'ADD':
        return 'add_circle_outline';
      case 'DELETE':
        return 'remove_circle_outline';
      case 'UPDATE':
        return 'edit_note';
      default:
        return 'info';
    }
  }

  getActionLabel(): string {
    switch (this.change.action) {
      case 'ADD':
        return 'Agregado';
      case 'DELETE':
        return 'Eliminado';
      case 'UPDATE':
        return 'Actualizado';
      default:
        return 'Cambio';
    }
  }

  getEntityIcon(): string {
    const icons: { [key: string]: string } = {
      'course': 'school',
      'module': 'library_books',
      'publication': 'article',
      'content': 'image'
    };
    return icons[this.change.entity_type] || 'edit';
  }

  getEntityLabel(): string {
    const labels: { [key: string]: string } = {
      'course': 'Curso',
      'module': 'Módulo',
      'publication': 'Publicación',
      'content': 'Contenido'
    };
    return labels[this.change.entity_type] || this.change.entity_type;
  }

  getDisplayValue(value: any): string {
    if (!value) return '(vacío)';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return JSON.stringify(value).substring(0, 100) + '...';
    }
    return String(value);
  }

  hasOldData(): boolean {
    return this.change.old_data !== null && this.change.old_data !== undefined;
  }

  hasNewData(): boolean {
    return this.change.new_data !== null && this.change.new_data !== undefined;
  }

  getChangeDescription(): string {
    if (this.change.field) {
      return `Campo: ${this.change.field}`;
    }
    return `${this.getEntityLabel()} - ${this.getActionLabel()}`;
  }

  // Helpers para renderizar componentes
  isModule(): boolean {
    return this.change.entity_type === 'module';
  }

  isContent(): boolean {
    return this.change.entity_type === 'content';
  }

  isPublication(): boolean {
    return this.change.entity_type === 'publication';
  }

  getActionClass(): string {
    switch (this.change.action) {
      case 'ADD':
        return 'action-add';
      case 'UPDATE':
        return 'action-update';
      case 'DELETE':
        return 'action-delete';
      default:
        return '';
    }
  }

  // Obtener información del módulo padre para publicaciones
  getParentModuleInfo(): { name: string | null; uuid: string | null } {
    if (!this.isPublication()) {
      return { name: null, uuid: null };
    }

    const data = this.change.new_data || this.change.old_data;
    if (!data) {
      return { name: null, uuid: null };
    }

    return {
      name: data.name_module || null,
      uuid: data.uuid_module || null
    };
  }

  // Obtener información de la publicación padre para contenido
  getParentPublicationInfo(): { name: string | null; uuid: string | null } {
    if (!this.isContent()) {
      return { name: null, uuid: null };
    }

    const data = this.change.new_data || this.change.old_data;
    if (!data) {
      return { name: null, uuid: null };
    }

    return {
      name: data.name_publication || null,
      uuid: data.uuid_publish || null
    };
  }


  // Obtener contenido para renderizar
  getContent(data: any): any[] | null {
    if (!data) {
      return null;
    }
    
    // Si es un array de contenido directo
    if (Array.isArray(data)) {
      return data.length > 0 ? data : null;
    }
    
    // Si es un objeto con propiedad content que es un array
    if (data.content && Array.isArray(data.content)) {
      return data.content.length > 0 ? data.content : null;
    }
    
    // Si es un objeto de contenido individual, envolver en array
    if (data.type_content && (data.content || data.id_content_course_publish)) {
      return [data];
    }
    
    return null;
  }

  // Manejar click en PDF
  onPdfClick(url: string): void {
    window.open(this.apiUrlBack + url, '_blank');
  }
}

