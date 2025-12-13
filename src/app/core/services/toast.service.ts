import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private counter = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const toast: Toast = {
      id: ++this.counter,
      message,
      type
    };

    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => this.remove(toast.id), 3000);
  }

  remove(id: number) {
    this.toastsSubject.next(
      this.toastsSubject.value.filter(t => t.id !== id)
    );
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error');
  }

  welcome(name: string) {
    this.success(`Bienvenido ${name} 👋`);
  }
}
