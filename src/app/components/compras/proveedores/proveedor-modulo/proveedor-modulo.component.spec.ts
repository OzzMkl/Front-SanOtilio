import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorModuloComponent } from './proveedor-modulo.component';

describe('ProveedorModuloComponent', () => {
  let component: ProveedorModuloComponent;
  let fixture: ComponentFixture<ProveedorModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedorModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
