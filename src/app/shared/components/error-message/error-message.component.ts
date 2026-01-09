import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css'
})
export class ErrorMessageComponent {
  @Input() message: string = '';
  @Input() showError: boolean = false;
}
