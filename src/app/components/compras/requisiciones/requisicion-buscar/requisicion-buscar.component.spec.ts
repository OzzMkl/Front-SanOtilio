import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionBuscarComponent } from './requisicion-buscar.component';

describe('RequisicionBuscarComponent', () => {
  let component: RequisicionBuscarComponent;
  let fixture: ComponentFixture<RequisicionBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicionBuscarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
