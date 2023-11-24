import { TestBed } from '@angular/core/testing';

import { PitHighlightService } from './pit-highlight.service';

describe('PitHighlightService', () => {
  let service: PitHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PitHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
