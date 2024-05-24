import { TestBed } from '@angular/core/testing';

import { CompraGuard } from './compra.guard';

describe('CompraGuard', () => {
  let guard: CompraGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CompraGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
