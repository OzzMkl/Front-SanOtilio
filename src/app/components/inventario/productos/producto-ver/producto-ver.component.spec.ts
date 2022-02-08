import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoVerComponent } from './producto-ver.component';

describe('ProductoVerComponent', () => {
  let component: ProductoVerComponent;
  let fixture: ComponentFixture<ProductoVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
