import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasRealizadasComponent } from './ventas-realizadas.component';

describe('VentasRealizadasComponent', () => {
  let component: VentasRealizadasComponent;
  let fixture: ComponentFixture<VentasRealizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasRealizadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasRealizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
