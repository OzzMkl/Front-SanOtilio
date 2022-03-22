import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraAgregarIdComponent } from './compra-agregar-id.component';

describe('CompraAgregarIdComponent', () => {
  let component: CompraAgregarIdComponent;
  let fixture: ComponentFixture<CompraAgregarIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraAgregarIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraAgregarIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
