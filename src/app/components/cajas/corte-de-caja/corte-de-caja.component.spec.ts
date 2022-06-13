import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteDeCajaComponent } from './corte-de-caja.component';

describe('CorteDeCajaComponent', () => {
  let component: CorteDeCajaComponent;
  let fixture: ComponentFixture<CorteDeCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteDeCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteDeCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
