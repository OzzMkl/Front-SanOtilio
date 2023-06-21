import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionAgregarComponent } from './requisicion-agregar.component';

describe('RequisicionAgregarComponent', () => {
  let component: RequisicionAgregarComponent;
  let fixture: ComponentFixture<RequisicionAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicionAgregarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
