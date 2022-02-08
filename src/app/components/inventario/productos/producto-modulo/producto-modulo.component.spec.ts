import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoModuloComponent } from './producto-modulo.component';

describe('ProductoModuloComponent', () => {
  let component: ProductoModuloComponent;
  let fixture: ComponentFixture<ProductoModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
