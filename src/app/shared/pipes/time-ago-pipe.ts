import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 30) return 'Hace un momento';
    if (seconds < 60) return 'Hace unos segundos';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;

    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months} mes${months > 1 ? 'es' : ''}`;

    const years = Math.floor(days / 365);
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  }
}
