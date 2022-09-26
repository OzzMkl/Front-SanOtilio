import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasAgregarComponent } from './entregas-agregar.component';

describe('EntregasAgregarComponent', () => {
  let component: EntregasAgregarComponent;
  let fixture: ComponentFixture<EntregasAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregasAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregasAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
