import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdencompraModuloComponent } from './ordencompra-modulo.component';

describe('OrdencompraModuloComponent', () => {
  let component: OrdencompraModuloComponent;
  let fixture: ComponentFixture<OrdencompraModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdencompraModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdencompraModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
