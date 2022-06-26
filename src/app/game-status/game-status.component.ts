import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StartEndGameNotificationService } from '../start-end-game-notification.service';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.css']
})
export class GameStatusComponent implements OnInit {
  timer: bigint = 0n;
  intervalId: any;
  @Output() gameOverEvent = new EventEmitter<void>();
  @Output() scoreEmitter = new EventEmitter<bigint>();

  constructor(
    private gameService: StartEndGameNotificationService,
  ) { }

  ngOnInit(): void {
    this.gameService.startGameSubject.subscribe(data => {
      if (data === 'start') {
        this.startTimer();
      }
      else if (data === 'stop') {
        this.scoreEmitter.emit(this.timer);
        this.stopTimer();
        this.gameOverEvent.emit();
      }
    })
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.intervalId);
    this.timer = 0n;
  }

}
