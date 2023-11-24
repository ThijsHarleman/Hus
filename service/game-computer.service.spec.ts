import { TestBed } from '@angular/core/testing';

import { GameComputerService } from './game-computer.service';

describe('GameComputerService', () => {
  let service: GameComputerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameComputerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
