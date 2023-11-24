import { Injectable } from '@angular/core';
import { Play } from 'src/model/play';
import { Player } from 'src/model/player';
import { BoardStateService } from './board-state.service';
import { PlayTurnService } from './play-turn.service';
import { GameBoard } from 'src/model/gameBoard';
import { Pit } from 'src/model/pit';
import { GameRow } from 'src/model/gameRow';

const MAX_LOOP = 10;

@Injectable({
  providedIn: 'root'
})
export class GameComputerService {

  constructor(
    private boardStateService: BoardStateService,
    private playTurnService: PlayTurnService
  ) { }

  calculateBestScoringPlay(player: Player, game: GameBoard): Play {
    var bestScore: number = this.playTurnService.getPlayerSeeds(player, game);
    var bestPlay: number = 0;
    var currentPlay: number = 0;
    var viablePlayFound: boolean = false;

    this.boardStateService.saveBoardState(game);

    this.playTurnService.getPlayerRows(player, game).forEach((row) => {
      row.pits.forEach((pit) => {
        if (pit.seeds > 1) {
          this.calculatePlay(pit, row, game);
          if (this.playTurnService.getPlayerSeeds(player, game) > bestScore || !viablePlayFound) {
            bestScore = this.playTurnService.getPlayerSeeds(player, game);
            bestPlay = currentPlay;
            viablePlayFound = true;
          }
          this.boardStateService.resetBoardState(game);
        }
        currentPlay++;
      })
    })    
    
    return this.playTurnService.buildPlayFromIndex(player, bestPlay, bestScore, game);
  }

  calculatePlay(pit: Pit, gameRow: GameRow, game: GameBoard) {
    var sowingRow = gameRow;
    var sowingId = pit.id;
    var sown = 0;

    game.gameVariables.seedsToSow = pit.seeds;
    pit.seeds = 0;

    while (game.gameVariables.seedsToSow > 0 && sown < (gameRow.pits.length * MAX_LOOP)) {
      sowingId++;
      if (sowingId < gameRow.pits.length) {
        this.playTurnService.seed(sowingRow.pits[sowingId], sowingRow, game);
        sown++;
      } else {
        sowingRow = this.playTurnService.getOtherRow(sowingRow, game);
        sowingId = -1;
      }
    }
  }

  computerPlay(player: Player, game: GameBoard) {
    game.gameVariables.calculatingPlay = true;
    var play: Play = this.determineBestPlay(player, game);
    game.gameVariables.calculatingPlay = false;

    if (play.pickedPit.seeds > 1) {
      game.gameVariables.lastPlay = play;
      this.playTurnService.pick(play.pickedPit, play.pickedGameRow, game);
    }
  }

  determineBestPlay(player: Player, game: GameBoard): Play {
    var bestPlay: Play = this.calculateBestScoringPlay(player, game);

    if (bestPlay.scoreTurnEnd > bestPlay.scoreTurnStart) {
      return bestPlay;
    }

    var pickedIndex: number = this.getRandomPitIndex(this.playTurnService.getPitIndexesWithMostSeeds(player, game));
    // var pickedIndex: number = this.getRandomPitIndex(this.playTurnService.getPitIndexesWith2OrMoreSeeds(player, game));
    bestPlay.pickedGameRow = this.playTurnService.getGameRowFromIndex(player, pickedIndex, game);
    bestPlay.pickedPit = this.playTurnService.getPitFromIndex(player, pickedIndex, game);

    return bestPlay;
  }

  simulatePlay(player: Player, game: GameBoard) {
    game.gameVariables.calculatingPlay = true;
    var play: Play = this.determineBestPlay(player, game);
    game.gameVariables.calculatingPlay = false;

    if (play.pickedPit.seeds > 1) {
      game.gameVariables.lastPlay = play;
      this.playTurnService.simulatePick(play.pickedPit, play.pickedGameRow, game);
    }
  }

  getRandomPitIndex(pitIndexes: number[]): number {
    return pitIndexes[Math.floor(Math.random() * pitIndexes.length)];
  }
}
