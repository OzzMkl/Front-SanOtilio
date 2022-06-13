import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasRealizadasModuloComponent } from './ventas-realizadas-modulo.component';

describe('VentasRealizadasModuloComponent', () => {
  let component: VentasRealizadasModuloComponent;
  let fixture: ComponentFixture<VentasRealizadasModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasRealizadasModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasRealizadasModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
