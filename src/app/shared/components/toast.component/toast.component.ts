import { Component } from '@angular/core';
import { Toast } from '../../../core/models/toast.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(
      t => this.toasts = t
    );
  }
  close(id: number) {
    this.toastService.remove(id);
  }

}
