import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GameSettings } from 'src/model/gameSettings';
import { GameSettingsService } from 'src/service/game-settings.service';

@Component({
  selector: 'app-game-properties-modal',
  templateUrl: './game-properties-modal.component.html',
  styleUrls: ['./game-properties-modal.component.css']
})
export class GamePropertiesModalComponent {
  @Input() gameSettings: GameSettings = {
    delay: 0,
    player1IsComputer: false,
    player2IsComputer: false,
    pitAmount: 0,
    seedsPerPit: 0
  }

  constructor(
    private activeModal: NgbActiveModal,
    private settingsService: GameSettingsService
  ) {
    this.gameSettings.delay = settingsService.delay$.value;
    this.gameSettings.player1IsComputer = settingsService.player1IsComputer$.value;
    this.gameSettings.player2IsComputer = settingsService.player2IsComputer$.value;
    this.gameSettings.pitAmount = settingsService.pitsPerRow$.value;
    this.gameSettings.seedsPerPit = settingsService.seedsPerPit$.value;
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  submit() {
    this.settingsService.setGameSettings(this.gameSettings);
    this.closeModal("Submit");
  }
}
