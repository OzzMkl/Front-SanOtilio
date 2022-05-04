import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionModuloComponent } from './cotizacion-modulo.component';

describe('CotizacionModuloComponent', () => {
  let component: CotizacionModuloComponent;
  let fixture: ComponentFixture<CotizacionModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
