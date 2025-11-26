import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/loader';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
  loading = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loading$.subscribe(v => this.loading = v);
  }
}
