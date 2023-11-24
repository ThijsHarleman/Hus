import { Injectable } from '@angular/core';
import { GameBoard } from 'src/model/gameBoard';
import { Pit } from 'src/model/pit';

@Injectable({
  providedIn: 'root'
})
export class PitHighlightService {
  
  highlightPit(pits: Pit[], game: GameBoard): Pit[] {
    if (!game.gameVariables.calculatingPlay) {
      this.removeHighlights(game);
      pits.forEach(pit => {
        pit.highlighted = true;
      })
    }
    return pits;
  }

  highlightStolenPit(pit: Pit, game: GameBoard) {
    if (!game.gameVariables.calculatingPlay) {
      pit.highlighted = true;
      game.gameVariables.previousPits.push(pit);
    }
  }

  removeHighlights(game: GameBoard) {
    game.gameVariables.previousPits.forEach(pit => {
      pit.highlighted = false;
    })
    game.gameVariables.previousPits = [];
  }
}
