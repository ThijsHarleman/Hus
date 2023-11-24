import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSimulationModalComponent } from './game-simulation-modal.component';

describe('GameSimulationModalComponent', () => {
  let component: GameSimulationModalComponent;
  let fixture: ComponentFixture<GameSimulationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSimulationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameSimulationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
