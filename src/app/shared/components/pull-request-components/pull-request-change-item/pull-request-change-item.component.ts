import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './pull-request-change-item.component.html',
  styleUrl: './pull-request-change-item.component.css'
})
export class PullRequestChangeItemComponent {
  @Input() change!: Change;

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
}
