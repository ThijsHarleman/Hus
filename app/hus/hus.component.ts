import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameBoard } from 'src/model/gameBoard';
import { GameRow } from 'src/model/gameRow';
import { Pit } from 'src/model/pit';
import { Player } from 'src/model/player';
import { GamePropertiesModalComponent } from '../game-properties-modal/game-properties-modal.component';
import { GameSettingsService } from 'src/service/game-settings.service';
import { GameSimulationModalComponent } from '../game-simulation-modal/game-simulation-modal.component';
import { GameSetupService } from 'src/service/game-setup.service';
import { GameComputerService } from 'src/service/game-computer.service';
import { PlayTurnService } from 'src/service/play-turn.service';

@Component({
  selector: 'app-hus',
  templateUrl: './hus.component.html',
  styleUrls: ['./hus.component.css']
})
export class HusComponent {

  frontRowPlayer1: GameRow;
  backRowPlayer1: GameRow;
  frontRowPlayer2: GameRow;
  backRowPlayer2: GameRow;
  game: GameBoard;

  constructor (
    private gameComputerService: GameComputerService,
    private modalService: NgbModal,
    private playTurnService: PlayTurnService,
    private settingsService: GameSettingsService,
    private setupService: GameSetupService
  ) {
    this.settingsService.updated$.subscribe(() => {
      this.newGame();
    })

    this.game = setupService.setupGame();
    this.frontRowPlayer1 = this.game.gameRows.at(0)!
    this.backRowPlayer1 = this.game.gameRows.at(1)!
    this.frontRowPlayer2 = this.game.gameRows.at(2)!
    this.backRowPlayer2 = this.game.gameRows.at(3)!
  }

  newGame() {
    this.game = this.setupService.setupGame();
    this.frontRowPlayer1 = this.game.gameRows.at(0)!
    this.backRowPlayer1 = this.game.gameRows.at(1)!
    this.frontRowPlayer2 = this.game.gameRows.at(2)!
    this.backRowPlayer2 = this.game.gameRows.at(3)!
  }

  computerPlay(player: Player) {
    this.gameComputerService.computerPlay(player, this.game);
  }

  playerPlay(pit: Pit, gameRow: GameRow) {
    this.playTurnService.playerPlay(pit, gameRow, this.game);
  }

  openGameSettingsModal() {
    this.modalService.open(GamePropertiesModalComponent, {
      centered: true,
      scrollable: true,
      size: "sm",
    });
  }

  openGameSimulationModal() {
    this.modalService.open(GameSimulationModalComponent, {
      centered: true,
      scrollable: true,
      size: "sm",
    });
  }

  getCurrentPlayer(): Player {
    return this.game.player1.hasTurn ? this.game.player1 : this.game.player2;
  }
}
