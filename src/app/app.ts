import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { AuthService } from './core/services/auth.service';
import { Loader } from "./shared/components/loader/loader";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Loader],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  router = inject(Router);
  constructor(private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.authService.loadCurrentUser().subscribe();
    }
  }

  protected readonly title = signal('proyect');
}
