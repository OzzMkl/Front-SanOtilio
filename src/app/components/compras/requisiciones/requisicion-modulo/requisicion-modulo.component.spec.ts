import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionModuloComponent } from './requisicion-modulo.component';

describe('RequisicionModuloComponent', () => {
  let component: RequisicionModuloComponent;
  let fixture: ComponentFixture<RequisicionModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicionModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
