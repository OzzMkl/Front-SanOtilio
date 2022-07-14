import { TestBed } from '@angular/core/testing';

import { CotizacionGuard } from './cotizacion.guard';

describe('CotizacionGuard', () => {
  let guard: CotizacionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CotizacionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
