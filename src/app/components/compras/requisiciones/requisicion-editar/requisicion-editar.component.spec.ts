import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionEditarComponent } from './requisicion-editar.component';

describe('RequisicionEditarComponent', () => {
  let component: RequisicionEditarComponent;
  let fixture: ComponentFixture<RequisicionEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicionEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
