import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVentasFinalizadasComponent } from './reportes-ventas-finalizadas.component';

describe('ReportesVentasFinalizadasComponent', () => {
  let component: ReportesVentasFinalizadasComponent;
  let fixture: ComponentFixture<ReportesVentasFinalizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesVentasFinalizadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesVentasFinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
