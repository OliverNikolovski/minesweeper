import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Square } from '../square';
import { StartEndGameNotificationService } from '../start-end-game-notification.service';

@Component({
  selector: 'app-mine-field',
  templateUrl: './mine-field.component.html',
  styleUrls: ['./mine-field.component.css']
})
export class MineFieldComponent implements OnInit {
  @Input() squareMatrix: Square[][] = [];
  @Input() numberOfMines: number = 0;
  @Input() numberOfSquaresLeft: number = 0;
  @Output() squareClickedEvent = new EventEmitter<Square>();
  @Output() squareFlaggedEvent = new EventEmitter<Square>();
  @Output() gameLostEvent = new EventEmitter();
  @Output() gameWonEvent = new EventEmitter();
  started: boolean = false;

  constructor(
    private gameService: StartEndGameNotificationService,
  ) { }

  ngOnInit(): void {

  }

  onClick(square: Square): void {
    if (!this.started) {
      this.started = true;
      this.gameService.notifyStart();
    }
    if (square.isOpen)
      return;
    if (square.isMined) {
      this.gameService.notifyStop();
      this.gameLostEvent.emit();
    }
    else if (this.numberOfSquaresLeft - 1 === this.numberOfMines) {
      this.gameService.notifyStop();
      this.gameWonEvent.emit();
    }
    else
      this.squareClickedEvent.emit(square);
  }

  onRightClick(event: MouseEvent, square: Square): void {
    event.preventDefault();
    if (square.isOpen || square.isFlagged)
      return;
    if (!this.started) {
      this.started = true;
      this.gameService.notifyStart();
    }
    this.squareFlaggedEvent.emit(square);
  }

}
