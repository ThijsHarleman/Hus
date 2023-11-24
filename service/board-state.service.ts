import { Injectable } from '@angular/core';
import { GameBoard } from 'src/model/gameBoard';
import { Player } from 'src/model/player';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {

  constructor() { }

  resetBoardState(game: GameBoard): GameBoard {
    var rowLength: number = game.gameRows.at(0)!.pits.length;
    var rowIndex: number = 0;

    game.gameRows.forEach(row => {
      row.pits.forEach(pit => {
        pit.seeds = game.gameVariables.boardBackup[pit.id + (rowIndex * rowLength)];
      })
      rowIndex++;
    })

    game.player1.seedsHeld = this.getPlayerSeeds(game.player1, game);
    game.player2.seedsHeld = this.getPlayerSeeds(game.player2, game);

    return game;
  }

  saveBoardState(game: GameBoard) {
    game.gameVariables.boardBackup = [];

    game.gameRows.forEach(row => {
      row.pits.forEach(pit => {
        game.gameVariables.boardBackup.push(pit.seeds);
      })
    })
  }

  getBoardState(game: GameBoard): number[] {
    var boardState: number[] = [];

    game.gameRows.forEach(row => {
      row.pits.forEach(pit => {
        boardState.push(pit.seeds);
      })
    })

    return boardState;
  }

  getPlayerSeeds(player: Player, game: GameBoard): number {
    var seedsHeld = 0;

    game.gameRows.forEach(row => {
      if (row.player == player) {
        row.pits.forEach(pit => {
          seedsHeld += pit.seeds;
        })
      }
    })

    return seedsHeld;
  }
}
