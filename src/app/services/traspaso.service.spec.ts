import { TestBed } from '@angular/core/testing';

import { TraspasoService } from './traspaso.service';

describe('TraspasoService', () => {
  let service: TraspasoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraspasoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
