import { Component, Input } from '@angular/core';
import { SimulationSettings } from 'src/model/simulationSettings';
import { GameComputerService } from 'src/service/game-computer.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GameSettingsService } from 'src/service/game-settings.service';
import { GameSetupService } from 'src/service/game-setup.service';
import { FileDownloadService } from 'src/service/file-download.service';
import { GameBoard } from 'src/model/gameBoard';
import { GameSettings } from 'src/model/gameSettings';
import { Player } from 'src/model/player';

@Component({
  selector: 'app-game-simulation-modal',
  templateUrl: './game-simulation-modal.component.html',
  styleUrl: './game-simulation-modal.component.css'
})
export class GameSimulationModalComponent {
  @Input() simulationSettings: SimulationSettings = {
    pitAmount: 8,
    seedsPerPit: 2,
    simulationAmount: 100
  }

  private settingsBackup: GameSettings;

  constructor(
    private activeModal: NgbActiveModal,
    private fileService: FileDownloadService,
    private gameComputerService: GameComputerService,
    private settingsService: GameSettingsService,
    private setupService: GameSetupService
  ) {
    this.settingsBackup = settingsService.getGameSettings();
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  runSimulation(): GameBoard[] {
    var games: GameBoard[] = [];

    for (let sim = 1; sim <= this.simulationSettings.simulationAmount; sim++) {
      console.log(sim)
      games.push(this.simulateGame());
    }

    return games;
  }

  simulateGame(): GameBoard {
    var game: GameBoard = this.setupService.setupGame();

    while (game.gameVariables.winner == undefined) {
      this.simulateTurn(game);
    }

    return game;
  }

  simulateTurn(game: GameBoard) {
    this.gameComputerService.simulatePlay(this.getPlayerWithTurn(game), game);
  }

  submit() {
    this.setGameSettings();
    this.fileService.download(this.runSimulation());
    this.resetGameSettings();
  }

  getPlayerWithTurn(game: GameBoard): Player {
    if (game.player1.hasTurn) {
      return game.player1;
    } else {
      return game.player2;
    }
  }

  resetGameSettings() {
    this.settingsService.setGameSettings(this.settingsBackup);
  }

  setGameSettings() {
    var gameSettings: GameSettings = {
      delay: this.settingsService.delay$.value,
      player1IsComputer: true,
      player2IsComputer: true,
      pitAmount: this.simulationSettings.pitAmount,
      seedsPerPit: this.simulationSettings.seedsPerPit
    }
    this.settingsService.setGameSettings(gameSettings);
  }
}
