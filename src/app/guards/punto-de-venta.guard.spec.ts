import { TestBed } from '@angular/core/testing';

import { PuntoDeVentaGuard } from './punto-de-venta.guard';

describe('PuntoDeVentaGuard', () => {
  let guard: PuntoDeVentaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PuntoDeVentaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
