import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, TemplateRef, OnDestroy, inject, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'app-modal-confirmation',
  imports: [CommonModule, OverlayModule, PortalModule],
  templateUrl: './modal-confirmation.html',
  styleUrl: './modal-confirmation.css'
})
export class ModalConfirmation implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() loading: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen) {
        setTimeout(() => this.openModal());
      } else {
        this.closeModal();
      }
    }
  }

  ngOnDestroy() {
    this.closeModal();
  }

  private openModal() {
    if (this.overlayRef || !this.modalTemplate) return;

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    const portal = new TemplatePortal(this.modalTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  private closeModal() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay') && !this.loading) {
      this.cancel.emit();
    }
  }

  onCancel() {
    if (!this.loading) {
      this.cancel.emit();
    }
  }

  onConfirm() {
    if (!this.loading) {
      this.confirm.emit();
    }
  }
}
