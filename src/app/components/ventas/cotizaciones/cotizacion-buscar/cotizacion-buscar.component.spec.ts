import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionBuscarComponent } from './cotizacion-buscar.component';

describe('CotizacionBuscarComponent', () => {
  let component: CotizacionBuscarComponent;
  let fixture: ComponentFixture<CotizacionBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionBuscarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
