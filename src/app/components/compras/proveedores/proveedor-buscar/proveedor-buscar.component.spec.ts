import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorBuscarComponent } from './proveedor-buscar.component';

describe('ProveedorBuscarComponent', () => {
  let component: ProveedorBuscarComponent;
  let fixture: ComponentFixture<ProveedorBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedorBuscarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
