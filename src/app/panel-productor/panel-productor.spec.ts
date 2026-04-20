import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProductor } from './panel-productor';

describe('PanelProductor', () => {
  let component: PanelProductor;
  let fixture: ComponentFixture<PanelProductor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelProductor],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelProductor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
