import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PullRequestService } from '../services/pull_request/pull-request.service';

@Injectable({ providedIn: 'root' })
export class PullRequestOwnerGuard implements CanActivate {
  constructor(
    private pullRequestService: PullRequestService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    const id = route.params['id'] || route.paramMap.get('id');
    if (!id) {
      return of(this.router.createUrlTree(['/courses']));
    }
    return this.pullRequestService.getPRById(id).pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/courses'])))
    );
  }
}
