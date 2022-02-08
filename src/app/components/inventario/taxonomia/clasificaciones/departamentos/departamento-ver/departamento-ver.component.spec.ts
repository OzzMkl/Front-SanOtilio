import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoVerComponent } from './departamento-ver.component';

describe('DepartamentoVerComponent', () => {
  let component: DepartamentoVerComponent;
  let fixture: ComponentFixture<DepartamentoVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
