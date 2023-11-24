import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameSettings } from 'src/model/gameSettings';

const DEFAULT_DELAY = 100;
const NO_DELAY = 0;
const DEFAULT_PITS_PER_ROW = 8;
const DEFAULT_SEEDS_PER_PIT = 2;

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {
  delay$ = new BehaviorSubject<number>(DEFAULT_DELAY);
  noDelay = NO_DELAY;
  player1IsComputer$ = new BehaviorSubject<boolean>(false);
  player2IsComputer$ = new BehaviorSubject<boolean>(false);
  pitsPerRow$ = new BehaviorSubject<number>(DEFAULT_PITS_PER_ROW);
  seedsPerPit$ = new BehaviorSubject<number>(DEFAULT_SEEDS_PER_PIT);
  updated$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  getGameSettings(): GameSettings {
    var gameSettings: GameSettings = {
      delay: this.delay$.value,
      player1IsComputer: this.player1IsComputer$.value,
      player2IsComputer: this.player2IsComputer$.value,
      pitAmount: this.pitsPerRow$.value,
      seedsPerPit: this.seedsPerPit$.value
    }

    return gameSettings;
  }

  setGameSettings(gameSettings: GameSettings) {
    this.delay$.next(gameSettings.delay);
    this.player1IsComputer$.next(gameSettings.player1IsComputer);
    this.player2IsComputer$.next(gameSettings.player2IsComputer);
    this.pitsPerRow$.next(gameSettings.pitAmount);
    this.seedsPerPit$.next(gameSettings.seedsPerPit);
    this.updated$.next(true);
  }
}
