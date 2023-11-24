import { Injectable } from '@angular/core';
import { GameRow } from 'src/model/gameRow';
import { Pit } from 'src/model/pit';
import { GameSettingsService } from './game-settings.service';
import { Player } from 'src/model/player';
import { GameBoard } from 'src/model/gameBoard';
import { GameVariables } from 'src/model/gameVariables';

const BUTTON_SIZE = 3;

@Injectable({
  providedIn: 'root'
})
export class GameSetupService {

  constructor(
    private settingsService: GameSettingsService
  ) { }

  addPits(gameRow: GameRow, pitAmount: number) {
    for (let i: number = 0; i < pitAmount; i++) {
      const pit: Pit = {id: i, highlighted: false, seeds: 0}
      gameRow.pits.push(pit);
    }
  }

  setInitialSeeds(gameBoard: GameBoard, seeds: number): GameBoard {
    gameBoard.gameRows.forEach(gameRow => {
      if (gameRow.frontRow) {
        for (let pit: number = (Math.round(gameRow.pits.length / 2)); pit < gameRow.pits.length; pit++) {
          gameRow.pits[pit].seeds = seeds;
        }
      } else {
        for (let pit: number = 0; pit < gameRow.pits.length; pit++) {
          gameRow.pits[pit].seeds = seeds;
        }
      }
    })

    var pitsPerRow: number = gameBoard.gameRows.at(0)!.pits.length;
    
    gameBoard.player1.seedsHeld = (pitsPerRow + Math.floor(pitsPerRow / 2)) * seeds;
    gameBoard.player2.seedsHeld = (pitsPerRow + Math.floor(pitsPerRow / 2)) * seeds;

    return gameBoard;
  }

  setupGame(): GameBoard {
    var gameBoard: GameBoard = this.setupGameBoard();

    gameBoard.gameRows.forEach((row) => {
      this.addPits(row, this.settingsService.pitsPerRow$.value)
      this.setInitialSeeds(gameBoard, this.settingsService.seedsPerPit$.value);
    })

    return gameBoard;
  }

  setupGameBoard(): GameBoard {
    var player1: Player = {id: 0, seedsHeld: 0, hasTurn: true, computer: this.settingsService.player1IsComputer$.value}
    var player2: Player = {id: 1, seedsHeld: 0, hasTurn: false, computer: this.settingsService.player2IsComputer$.value}

    var frontRowPlayer1: GameRow = {player: player1, frontRow: true, pits: []}
    var backRowPlayer1: GameRow = {player: player1, frontRow: false, pits: []}

    var frontRowPlayer2: GameRow = {player: player2, frontRow: true, pits: []}
    var backRowPlayer2: GameRow = {player: player2, frontRow: false, pits: []}

    return {
      gameRows: [
        frontRowPlayer1,
        backRowPlayer1,
        frontRowPlayer2,
        backRowPlayer2
      ],
      gameVariables: this.setupGameVariables(),
      player1: player1,
      player2: player2
    }
  }

  setupGameVariables(): GameVariables {
    return {
      allowClick: true,
      boardBackup: [],
      boardWidth: this.settingsService.pitsPerRow$.value * BUTTON_SIZE + "rem",
      calculatingPlay: false,
      gameOver: false,
      lastPlay: undefined,
      playHistory: [],
      previousPits: [],
      seedsToSow: 0,
      turnNumber: 1,
      winner: undefined
    }
  }
}
