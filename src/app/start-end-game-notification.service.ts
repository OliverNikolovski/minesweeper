import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartEndGameNotificationService {
  startGameSubject = new Subject<string>();

  constructor() { }

  notifyStart(): void {
    this.startGameSubject.next('start');
  }

  notifyStop(): void {
    this.startGameSubject.next('stop');
  }
}
