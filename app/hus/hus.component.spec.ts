import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HusComponent } from './hus.component';

describe('HusComponent', () => {
  let component: HusComponent;
  let fixture: ComponentFixture<HusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HusComponent]
    });
    fixture = TestBed.createComponent(HusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
