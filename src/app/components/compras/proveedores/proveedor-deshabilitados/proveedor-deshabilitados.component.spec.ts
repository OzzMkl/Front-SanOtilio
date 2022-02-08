import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorDeshabilitadosComponent } from './proveedor-deshabilitados.component';

describe('ProveedorDeshabilitadosComponent', () => {
  let component: ProveedorDeshabilitadosComponent;
  let fixture: ComponentFixture<ProveedorDeshabilitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedorDeshabilitadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorDeshabilitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
