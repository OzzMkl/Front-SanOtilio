import { TestBed } from '@angular/core/testing';

import { RolGuard } from './rol.guard';

describe('RolGuard', () => {
  let guard: RolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
