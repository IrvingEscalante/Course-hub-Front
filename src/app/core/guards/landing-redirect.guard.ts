import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, take } from 'rxjs';

export const landingRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1️⃣ Si ya hay usuario cargado → redirigir a cursos
  if (authService.currentUserValue) {
    return router.parseUrl('/courses');
  }

  // 2️⃣ Si no hay token → permitir ver la landing page
  if (!authService.getToken()) {
    return true;
  }

  // 3️⃣ Hay token pero no usuario → cargar y esperar
  return authService.loadCurrentUser().pipe(
    take(1),
    map(user => {
      if (user) {
        return router.parseUrl('/courses');
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
