import { TestBed } from '@angular/core/testing';

import { OrdencompraGuardGuard } from './ordencompra-guard.guard';

describe('OrdencompraGuardGuard', () => {
  let guard: OrdencompraGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OrdencompraGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
