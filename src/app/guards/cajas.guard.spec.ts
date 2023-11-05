import { TestBed } from '@angular/core/testing';

import { CajasGuard } from './cajas.guard';

describe('CajasGuard', () => {
  let guard: CajasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CajasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
