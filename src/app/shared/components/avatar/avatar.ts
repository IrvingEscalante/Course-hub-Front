import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css'
})
export class Avatar {
  @Input() name: string = '';
  @Input() photo: string = '';
  @Input() size: number = 40;

  colors: any = {
    A: '#F44336', // rojo
    B: '#E91E63',
    C: '#9C27B0',
    D: '#673AB7',
    E: '#3F51B5',
    F: '#2196F3',
    G: '#03A9F4',
    H: '#00BCD4',
    I: '#009688',
    J: '#8E24AA', // morado (como querías)
    K: '#4CAF50',
    L: '#8BC34A',
    M: '#CDDC39',
    N: '#FFEB3B',
    O: '#FFC107',
    P: '#FF9800',
    Q: '#FF5722',
    R: '#795548',
    S: '#607D8B',
    T: '#9E9E9E',
    U: '#6A1B9A',
    V: '#283593',
    W: '#00695C',
    X: '#2E7D32',
    Y: '#0277BD',
    Z: '#C62828'
  };

  get initial() {
    return this.name ? this.name.trim().charAt(0).toUpperCase() : '?';
  }

  get bgColor() {
    return this.colors[this.initial] ?? '#9E9E9E';
  }
}
