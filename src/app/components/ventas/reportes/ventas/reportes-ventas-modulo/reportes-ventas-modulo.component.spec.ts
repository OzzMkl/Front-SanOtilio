import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVentasModuloComponent } from './reportes-ventas-modulo.component';

describe('ReportesVentasModuloComponent', () => {
  let component: ReportesVentasModuloComponent;
  let fixture: ComponentFixture<ReportesVentasModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesVentasModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesVentasModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
