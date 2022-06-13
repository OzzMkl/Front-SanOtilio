import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaModuloComponent } from './caja-modulo.component';

describe('CajaModuloComponent', () => {
  let component: CajaModuloComponent;
  let fixture: ComponentFixture<CajaModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CajaModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
