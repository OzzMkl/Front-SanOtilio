import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdencompraAgregarComponent } from './ordencompra-agregar.component';

describe('OrdencompraAgregarComponent', () => {
  let component: OrdencompraAgregarComponent;
  let fixture: ComponentFixture<OrdencompraAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdencompraAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdencompraAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
