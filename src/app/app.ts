import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { AuthService } from './core/services/auth.service';
import { Loader } from "./shared/components/loader/loader";
import { ToastrModule } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Loader, ToastrModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
   constructor(private authService: AuthService, private router: Router) {
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
