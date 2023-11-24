import { Injectable } from '@angular/core';
import { GameBoard } from 'src/model/gameBoard';
import { Play } from 'src/model/play';
import { Player } from 'src/model/player';
import { PitHighlightService } from './pit-highlight.service';
import { Pit } from 'src/model/pit';
import { GameRow } from 'src/model/gameRow';
import { GameSettingsService } from './game-settings.service';
import { BoardStateService } from './board-state.service';

const MAX_LOOP = 10;

@Injectable({
  providedIn: 'root'
})
export class PlayTurnService {

  constructor(
    private boardStateService: BoardStateService,
    private pitHighlightService: PitHighlightService,
    private settingsService: GameSettingsService
  ) { }

  addPlayToHistory(play: Play, game: GameBoard) {
    game.gameVariables.playHistory.push(play);
  }

  finishTurn(player: Player, game: GameBoard) {
    this.pitHighlightService.removeHighlights(game);
    if (game.gameVariables.lastPlay != undefined) {
      game.gameVariables.lastPlay.boardTurnEnd = this.boardStateService.getBoardState(game);
      this.correctScoreLastPlay(game.gameVariables.lastPlay, game);
      this.addPlayToHistory(game.gameVariables.lastPlay, game);
      game.gameVariables.lastPlay = undefined;
    }
    if (this.isGameOver(this.getOtherPlayer(player, game), game)) {
      player.hasTurn = false;
      game.gameVariables.gameOver = true;
      game.gameVariables.winner = player;
    } else {
      this.switchTurn(player, game);
      game.gameVariables.allowClick = true;
    }
  }

  playerPlay(pit: Pit, gameRow: GameRow, game: GameBoard) {
    if (gameRow.player.hasTurn
        && !gameRow.player.computer
        && pit.seeds > 1
        && game.gameVariables.allowClick) {
      game.gameVariables.allowClick = false;
      game.gameVariables.lastPlay = this.buildPlay(gameRow.player, pit, gameRow, game);
      this.pick(pit, gameRow, game);
    }
  }

  pick(pit: Pit, gameRow: GameRow, game: GameBoard) {
    var sowingRow = gameRow;
    var sowingId = pit.id;
    var delay = this.settingsService.noDelay;

    game.gameVariables.seedsToSow = pit.seeds;
    pit.seeds = 0;

    const loop = () => {
      setTimeout(() => {
        if (game.gameVariables.seedsToSow > 0) {
          sowingId++;
          if (sowingId < gameRow.pits.length) {
            game.gameVariables.previousPits = this.pitHighlightService.highlightPit([sowingRow.pits[sowingId]], game);
            this.seed(sowingRow.pits[sowingId], sowingRow, game);
            delay = this.settingsService.delay$.value;
          } else {
            sowingRow = this.getOtherRow(sowingRow, game);
            sowingId = -1;
            delay = this.settingsService.noDelay;
          }
          loop();
        } else {
          this.finishTurn(gameRow.player, game);
        }
      }, delay);
    }
    loop();
  }

  seed(pit: Pit, gameRow: GameRow, game: GameBoard) {
    if (game.gameVariables.seedsToSow == 1 && pit.seeds != 0) {
      game.gameVariables.seedsToSow += this.steal(pit, gameRow, game);
      game.gameVariables.seedsToSow += pit.seeds;
      pit.seeds = 0;
    } else {
      pit.seeds++;
      game.gameVariables.seedsToSow--;
    }

    game.player1.seedsHeld = this.getPlayerSeeds(game.player1, game);
    game.player2.seedsHeld = this.getPlayerSeeds(game.player2, game);
  }

  simulatePick(pit: Pit, gameRow: GameRow, game: GameBoard) {
    var sowingRow = gameRow;
    var sowingId = pit.id;
    var sown = 0;

    game.gameVariables.seedsToSow = pit.seeds;
    pit.seeds = 0;

    while (game.gameVariables.seedsToSow > 0 && sown < (gameRow.pits.length * MAX_LOOP)) {
      sowingId++;
      if (sowingId < gameRow.pits.length) {
        this.seed(sowingRow.pits[sowingId], sowingRow, game);
        sown++;
      } else {
        sowingRow = this.getOtherRow(sowingRow, game);
        sowingId = -1;
      }
    }

    if (game.gameVariables.seedsToSow > 0) {
      console.log("dropped seeds!")
      game.gameRows.forEach(row => {
        console.log(row.pits)
      })
    }

    this.finishTurn(gameRow.player, game);
  }

  steal(pit: Pit, gameRow: GameRow, game: GameBoard): number {
    var stolenSeeds = 0;
    if (gameRow.frontRow) {
      const frontPit: Pit = this.getPlayerRows(
        this.getOtherPlayer(gameRow.player, game), game)[0].pits[gameRow.pits.length - 1 - pit.id];
      if (frontPit.seeds > 0) {
        const backPit: Pit = this.getPlayerRows(
          this.getOtherPlayer(gameRow.player, game), game)[1].pits[pit.id];
        stolenSeeds += frontPit.seeds + backPit.seeds;
        frontPit.seeds = 0;
        this.pitHighlightService.highlightStolenPit(frontPit, game);
        if (backPit.seeds > 0) {
          backPit.seeds = 0;
          this.pitHighlightService.highlightStolenPit(backPit, game);
        }
      }
    }

    return stolenSeeds;
  }

  switchTurn(player: Player, game: GameBoard) {
    if (player == game.player1) {
      game.player1.hasTurn = false;
      game.player2.hasTurn = true;
    } else {
      game.player1.hasTurn = true;
      game.player2.hasTurn = false;
      game.gameVariables.turnNumber++;
    }
  }

  buildPlayFromIndex(player: Player, pickedPitIndex: number, scoreTurnEnd: number, game: GameBoard): Play {
    return {
      player: player,
      turn: game.gameVariables.turnNumber,
      pickedPit: this.getPitFromIndex(player, pickedPitIndex, game),
      pickedGameRow: this.getGameRowFromIndex(player, pickedPitIndex, game),
      scoreTurnStart: this.getPlayerSeeds(player, game),
      scoreTurnEnd: scoreTurnEnd,
      boardTurnEnd: []
    }
  }

  buildPlay(player: Player, pickedPit: Pit, pickedGameRow: GameRow, game: GameBoard): Play {
    return {
      player: player,
      turn: game.gameVariables.turnNumber,
      pickedPit: pickedPit,
      pickedGameRow: pickedGameRow,
      scoreTurnStart: this.getPlayerSeeds(player, game),
      scoreTurnEnd: this.getPlayerSeeds(player, game),
      boardTurnEnd: []
    }
  }

  correctScoreLastPlay(play: Play, game: GameBoard) {
    play.scoreTurnEnd = this.getPlayerSeeds(play.player, game); 
  }

  getOtherPlayer(player: Player, game: GameBoard): Player {
    if (player == game.player1) {
      return game.player2;
    } else {
      return game.player1;
    }
  }
  
  getOtherRow(gameRow: GameRow, game: GameBoard) {
    if (gameRow.player == game.player1) {
      if (gameRow.frontRow) {
        return game.gameRows.at(1)!;
      } else {
        return game.gameRows.at(0)!;
      }
    } else {
      if (gameRow.frontRow) {
        return game.gameRows.at(3)!;
      } else {
        return game.gameRows.at(2)!;
      }
    }
  }

  getPitFromIndex(player: Player, pitIndex: number, game: GameBoard): Pit {
    if (pitIndex < game.gameRows.at(0)!.pits.length) {
      return this.getPlayerRows(player, game)[0].pits[pitIndex];
    } else {
      return this.getPlayerRows(player, game)[1].pits[pitIndex - game.gameRows.at(0)!.pits.length];
    }
  }

  getPitIndexesWithMostSeeds(player: Player, game: GameBoard): number[] {
    var currentIndex: number = 0;
    var indexesWithMostSeeds: number[] = [];
    var mostSeeds: number = 0;

    this.getPlayerRows(player, game).forEach(row => {
      row.pits.forEach(pit => {
        if (pit.seeds > mostSeeds) {
          mostSeeds = pit.seeds;
          indexesWithMostSeeds = [currentIndex];
        } else if (pit.seeds == mostSeeds) {
          indexesWithMostSeeds.push(currentIndex)
        }
        currentIndex++;
      })
    })

    return indexesWithMostSeeds;
  }

  getPitIndexesWith2OrMoreSeeds(player: Player, game: GameBoard): number[] {
    var currentIndex: number = 0;
    var indexesWith2OrMoreSeeds: number[] = [];

    this.getPlayerRows(player, game).forEach(row => {
      row.pits.forEach(pit => {
        if (pit.seeds > 1) {
          indexesWith2OrMoreSeeds.push(currentIndex);
        }
        currentIndex++;
      })
    })

    if (indexesWith2OrMoreSeeds.length < 1) {
      indexesWith2OrMoreSeeds.push(0);
    }

    return indexesWith2OrMoreSeeds;
  }

  getPlayerRows(player: Player, game: GameBoard): GameRow[] {
    if (player == game.player1) {
      return [game.gameRows.at(0)!, game.gameRows.at(1)!];
    } else {
      return [game.gameRows.at(2)!, game.gameRows.at(3)!];
    }
  }

  getPlayerSeeds(player: Player, game: GameBoard): number {
    var sumOfSeeds: number = 0;

    if (player == game.player1) {
      sumOfSeeds += this.getRowSeeds(game.gameRows.at(0)!);
      sumOfSeeds += this.getRowSeeds(game.gameRows.at(1)!);

      if (game.player1.hasTurn) {
        sumOfSeeds += game.gameVariables.seedsToSow;
      }
    } else {
      sumOfSeeds += this.getRowSeeds(game.gameRows.at(2)!);
      sumOfSeeds += this.getRowSeeds(game.gameRows.at(3)!);

      if (game.player2.hasTurn) {
        sumOfSeeds += game.gameVariables.seedsToSow;
      }
    }
    return sumOfSeeds;
  }

  getGameRowFromIndex(player: Player, pitIndex: number, game: GameBoard): GameRow {
    if (pitIndex < game.gameRows.at(0)!.pits.length) {
      return this.getPlayerRows(player, game)[0];
    } else {
      return this.getPlayerRows(player, game)[1];
    }
  }

  getRowSeeds(gameRow: GameRow): number {
    var sumOfSeeds: number = 0;

    gameRow.pits.forEach((pit) => {
      sumOfSeeds += pit.seeds;
    })

    return sumOfSeeds;
  }

  isGameOver(player: Player, game: GameBoard): boolean {
    return this.getPitFromIndex(player, this.getPitIndexesWithMostSeeds(player, game)[0], game).seeds < 2;
  }
}
