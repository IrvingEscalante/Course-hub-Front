import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmation',
  imports: [CommonModule],
  templateUrl: './modal-confirmation.html',
  styleUrl: './modal-confirmation.css'
})
export class ModalConfirmation {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() loading: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancel.emit();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    if (!this.loading) {
      this.confirm.emit();
    }
  }
}
