import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasPendientesComponent } from './entregas-pendientes.component';

describe('EntregasPendientesComponent', () => {
  let component: EntregasPendientesComponent;
  let fixture: ComponentFixture<EntregasPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregasPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
