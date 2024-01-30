import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVentasCanceladasComponent } from './reportes-ventas-canceladas.component';

describe('ReportesVentasCanceladasComponent', () => {
  let component: ReportesVentasCanceladasComponent;
  let fixture: ComponentFixture<ReportesVentasCanceladasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesVentasCanceladasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesVentasCanceladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
