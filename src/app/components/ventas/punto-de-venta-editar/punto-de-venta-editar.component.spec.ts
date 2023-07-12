import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoDeVentaEditarComponent } from './punto-de-venta-editar.component';

describe('PuntoDeVentaEditarComponent', () => {
  let component: PuntoDeVentaEditarComponent;
  let fixture: ComponentFixture<PuntoDeVentaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoDeVentaEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuntoDeVentaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
