import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollerViewComponent } from './doller-view.component';

describe('DollerViewComponent', () => {
  let component: DollerViewComponent;
  let fixture: ComponentFixture<DollerViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DollerViewComponent]
    });
    fixture = TestBed.createComponent(DollerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
