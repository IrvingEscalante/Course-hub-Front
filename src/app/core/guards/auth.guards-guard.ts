import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, take } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authGuardsGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  // 1️⃣ Si ya hay usuario cargado
  if (authService.currentUserValue) {
    return true;
  }

  // 2️⃣ Si no hay token → fuera
  if (!authService.getToken()) {
    toastService.show("Inicia sesión para poder crear un curso");
    return router.parseUrl('/login');
  }

  // 3️⃣ Hay token pero no usuario → cargar y esperar
  return authService.loadCurrentUser().pipe(
    take(1),
    map(user => {
      return user ? true : router.parseUrl('/login');
    }),
    catchError(() => of(router.parseUrl('/login')))
  );
};