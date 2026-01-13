import { CanActivateFn } from '@angular/router';

export const versionGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
