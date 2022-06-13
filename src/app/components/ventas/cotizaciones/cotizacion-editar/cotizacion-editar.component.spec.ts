import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionEditarComponent } from './cotizacion-editar.component';

describe('CotizacionEditarComponent', () => {
  let component: CotizacionEditarComponent;
  let fixture: ComponentFixture<CotizacionEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
