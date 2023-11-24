import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePropertiesModalComponent } from './game-properties-modal.component';

describe('GamePropertiesModalComponent', () => {
  let component: GamePropertiesModalComponent;
  let fixture: ComponentFixture<GamePropertiesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamePropertiesModalComponent]
    });
    fixture = TestBed.createComponent(GamePropertiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
