import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoDeVentaComponent } from './punto-de-venta.component';

describe('PuntoDeVentaComponent', () => {
  let component: PuntoDeVentaComponent;
  let fixture: ComponentFixture<PuntoDeVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoDeVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoDeVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
