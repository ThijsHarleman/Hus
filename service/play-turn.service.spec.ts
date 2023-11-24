import { TestBed } from '@angular/core/testing';

import { PlayTurnService } from './play-turn.service';

describe('PlayTurnService', () => {
  let service: PlayTurnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayTurnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
