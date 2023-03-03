import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraEditarComponent } from './compra-editar.component';

describe('CompraEditarComponent', () => {
  let component: CompraEditarComponent;
  let fixture: ComponentFixture<CompraEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
