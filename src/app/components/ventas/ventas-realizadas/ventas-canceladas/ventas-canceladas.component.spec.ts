import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasCanceladasComponent } from './ventas-canceladas.component';

describe('VentasCanceladasComponent', () => {
  let component: VentasCanceladasComponent;
  let fixture: ComponentFixture<VentasCanceladasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasCanceladasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasCanceladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
