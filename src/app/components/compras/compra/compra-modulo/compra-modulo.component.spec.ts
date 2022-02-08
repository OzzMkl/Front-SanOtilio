import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraModuloComponent } from './compra-modulo.component';

describe('CompraModuloComponent', () => {
  let component: CompraModuloComponent;
  let fixture: ComponentFixture<CompraModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
