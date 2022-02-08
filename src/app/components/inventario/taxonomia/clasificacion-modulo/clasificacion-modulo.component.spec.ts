import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionModuloComponent } from './clasificacion-modulo.component';

describe('ClasificacionModuloComponent', () => {
  let component: ClasificacionModuloComponent;
  let fixture: ComponentFixture<ClasificacionModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificacionModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificacionModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
