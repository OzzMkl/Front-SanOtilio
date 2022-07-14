import { TestBed } from '@angular/core/testing';

import { ClienteGuard } from './cliente.guard';

describe('ClienteGuard', () => {
  let guard: ClienteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
