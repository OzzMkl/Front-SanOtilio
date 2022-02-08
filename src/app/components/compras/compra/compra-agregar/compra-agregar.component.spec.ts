import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraAgregarComponent } from './compra-agregar.component';

describe('CompraAgregarComponent', () => {
  let component: CompraAgregarComponent;
  let fixture: ComponentFixture<CompraAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
