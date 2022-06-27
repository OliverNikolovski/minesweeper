import { Component, Input, OnInit } from '@angular/core';
import { Square } from '../square';
import { StartEndGameNotificationService } from '../start-end-game-notification.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  squareMatrix: Square[][] = [];
  rows: number = 9;
  cols: number = 9;
  p: number = 0.1;
  numberOfMines = 0;
  numberOfSquaresLeft = 0;
  playAgain: boolean = false;
  //started: boolean = false;
  gameResult: 'You Won!' | 'You Lost!' | null = null;
  score: bigint | null = null;

  constructor(
    private gameStartEndNotificationService: StartEndGameNotificationService,
  ) { }

  ngOnInit(): void {
    this.initSquareMatrix();
  }

  initSquareMatrix(): void {
    this.gameResult = null;
    this.squareMatrix = [];
    this.numberOfMines = 0;
    this.score = null;
    for (let i = 0; i < this.rows; i++) {
      this.squareMatrix.push([]);
      for (let j = 0; j < this.cols; j++) {
        const isMined = Math.random() <= this.p; 
        if (isMined)
          this.numberOfMines++;
        const square: Square = {i: i, j: j, isOpen: false, isFlagged: false, isMined: isMined}
        this.squareMatrix[i].push(square);
      }
    }
    this.numberOfSquaresLeft = this.squareMatrix.flatMap(row => row).length;
  }

  prepareNewSquareMatrix(): void {
    this.initSquareMatrix();
    this.gameStartEndNotificationService.notifyStart();
    //this.started = false;
    this.playAgain = false;
  }

  openSquare(square: Square): void {
    square.isOpen = true;
    this.numberOfSquaresLeft--;
    //console.log(this.numberOfSquaresLeft);
    let mines = this.calculateNeighbouringMines(square);
    square.content = mines;
    if (mines === 0) {
      for (let neighbour of this.getNeighbours(square)) {
        if (!neighbour.isOpen)
          this.openSquare(neighbour);
      }
    }
  }

  flagSquare(square: Square): void {
    if (square.isFlagged) {
      square.isFlagged = false;
      square.content = '';
    }
    else {
      square.isFlagged = true;
      square.content = '🚩';
    }
  }

  gameWon(): void {
    this.uncoverAllSquares();
    this.gameResult = 'You Won!';
  }

  gameLost(): void {
    this.uncoverAllSquares();
    this.gameResult = 'You Lost!';
  }

  uncoverAllSquares(): void {
    this.squareMatrix.flatMap(row => row)
      .forEach(square => {
        square.isOpen = true;
        if (square.isMined)
          square.content = '💣';
        else
          square.content = this.calculateNeighbouringMines(square);
      });
  }

  saveScore(score: bigint): void {
    this.score = score;
  }

  showPlayAgainButton(): void {
    this.playAgain = true;
  }

  private calculateNeighbouringMines(square: Square): number {
    let mines = 0;
    const [i, j] = [square.i, square.j];
    let squareToCheck = this.squareMatrix[i - 1] ? this.squareMatrix[i - 1][j - 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i - 1] ? this.squareMatrix[i - 1][j] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i - 1] ? this.squareMatrix[i - 1][j + 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i][j - 1];
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i][j + 1];
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i + 1] ? this.squareMatrix[i + 1][j - 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i + 1] ? this.squareMatrix[i + 1][j] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.squareMatrix[i + 1] ? this.squareMatrix[i + 1][j + 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    return mines;
  }

  private getNeighbours(square: Square): Square[] {
    const neighbours: Square[] = [];
    const [i, j] = [square.i, square.j];
    if (i > 0) {
      neighbours.push(this.squareMatrix[i - 1][j]);
    }
    if (i < this.squareMatrix.length - 1) {
      neighbours.push(this.squareMatrix[i + 1][j]);
    }
    if (j > 0) {
      neighbours.push(this.squareMatrix[i][j - 1]);
    }
    if (j < this.squareMatrix[0].length - 1) {
      neighbours.push(this.squareMatrix[i][j + 1]);
    }
    if (i > 0 && j > 0) {
      neighbours.push(this.squareMatrix[i - 1][j - 1]);
    }
    if (i > 0 && j < this.squareMatrix[0].length - 1) {
      neighbours.push(this.squareMatrix[i - 1][j + 1]);
    }
    if (i < this.squareMatrix.length - 1 && j > 0) {
      neighbours.push(this.squareMatrix[i + 1][j - 1]);
    }
    if (i < this.squareMatrix.length - 1 && j < this.squareMatrix[0].length - 1) {
      neighbours.push(this.squareMatrix[i + 1][j + 1]);
    }
    return neighbours;
  }

  public squaresLeft(): number {
    return this.squareMatrix.flatMap(row => row).filter(square => !square.isOpen).length;
  }

}
