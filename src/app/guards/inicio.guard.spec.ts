import { TestBed } from '@angular/core/testing';

import { InicioGuard } from './inicio.guard';

describe('InicioGuard', () => {
  let guard: InicioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InicioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
