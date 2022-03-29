import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdencompraEditarComponent } from './ordencompra-editar.component';

describe('OrdencompraEditarComponent', () => {
  let component: OrdencompraEditarComponent;
  let fixture: ComponentFixture<OrdencompraEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdencompraEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdencompraEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
