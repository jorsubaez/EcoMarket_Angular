import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productores } from './productores';

describe('Productores', () => {
  let component: Productores;
  let fixture: ComponentFixture<Productores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productores],
    }).compileComponents();

    fixture = TestBed.createComponent(Productores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
