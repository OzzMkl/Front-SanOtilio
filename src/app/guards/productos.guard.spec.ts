import { TestBed } from '@angular/core/testing';

import { ProductosGuard } from './productos.guard';

describe('ProductosGuard', () => {
  let guard: ProductosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProductosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
