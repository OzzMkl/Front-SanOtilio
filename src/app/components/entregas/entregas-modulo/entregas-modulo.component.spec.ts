import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasModuloComponent } from './entregas-modulo.component';

describe('EntregasModuloComponent', () => {
  let component: EntregasModuloComponent;
  let fixture: ComponentFixture<EntregasModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregasModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregasModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
