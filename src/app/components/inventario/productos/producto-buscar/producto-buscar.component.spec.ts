import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoBuscarComponent } from './producto-buscar.component';

describe('ProductoBuscarComponent', () => {
  let component: ProductoBuscarComponent;
  let fixture: ComponentFixture<ProductoBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoBuscarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
