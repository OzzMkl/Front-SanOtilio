import { TestBed } from '@angular/core/testing';

import { CheckTokenGuard } from './check-token.guard';

describe('CheckTokenGuard', () => {
  let guard: CheckTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
