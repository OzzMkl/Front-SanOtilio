import { TestBed } from '@angular/core/testing';

import { RequisicionGuard } from './requisicion.guard';

describe('RequisicionGuard', () => {
  let guard: RequisicionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RequisicionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
