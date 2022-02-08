import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDeshabilitadosComponent } from './producto-deshabilitados.component';

describe('ProductoDeshabilitadosComponent', () => {
  let component: ProductoDeshabilitadosComponent;
  let fixture: ComponentFixture<ProductoDeshabilitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoDeshabilitadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoDeshabilitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
